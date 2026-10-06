const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { requireStudent } = require('../middleware/requireStudent');
const { tenseToCode } = require('../services/tenses');
const { sendError } = require('../utils/errors');

// Todas as rotas de vocabulário exigem X-Student-Id
router.use(requireStudent);

// GET /api/vocabulary?type=verb&level=B1&status=red&q=run
router.get('/', async (req, res) => {
  try {
    const sid = req.studentId;
    const { type, level, status, q, lang, language_code } = req.query;
    const targetLang = language_code || lang;

    let query = `
      SELECT vi.*,
        sv.mastery_level, sv.status, sv.total_reviews, sv.total_correct,
        sv.total_incorrect, sv.next_review_at, sv.last_reviewed_at,
        sv.review_priority, sv.consecutive_incorrect, sv.recent_errors,
        sv.acquired_at,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', m.id, 'text', m.meaning_text, 'lang', m.language))
          FILTER (WHERE m.id IS NOT NULL), '[]'
        ) as meanings,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.context_name, 'description', c.description))
          FILTER (WHERE c.id IS NOT NULL), '[]'
        ) as contexts,
        vf.past_simple, vf.past_participle, vf.present_participle, vf.third_person_singular
      FROM vocabulary_items vi
      JOIN student_vocabulary sv ON sv.vocabulary_item_id = vi.id AND sv.student_id = $1
      LEFT JOIN meanings m ON m.vocabulary_item_id = vi.id
      LEFT JOIN contexts c ON c.vocabulary_item_id = vi.id AND c.student_id = $1
      LEFT JOIN verb_forms vf ON vf.vocabulary_item_id = vi.id
      WHERE vi.student_id = $1
    `;

    const params = [sid];
    let paramIndex = 2;

    if (type)   { query += ` AND vi.type = $${paramIndex++}`;   params.push(type); }
    if (level)  { query += ` AND vi.level = $${paramIndex++}`;  params.push(level); }
    if (status) { query += ` AND sv.status = $${paramIndex++}`; params.push(status); }
    if (targetLang) { query += ` AND vi.language_code = $${paramIndex++}`; params.push(targetLang); }
    if (q) {
      query += ` AND (vi.word ILIKE $${paramIndex} OR vi.primary_meaning ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }

    query += ` GROUP BY vi.id, sv.mastery_level, sv.status, sv.total_reviews, sv.total_correct,
               sv.total_incorrect, sv.next_review_at, sv.last_reviewed_at, sv.review_priority,
               sv.consecutive_incorrect, sv.recent_errors, sv.acquired_at,
               vf.past_simple, vf.past_participle, vf.present_participle, vf.third_person_singular
               ORDER BY vi.word`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// GET /api/vocabulary/:id
router.get('/:id', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;

    const vocabRes = await db.query(`
      SELECT vi.*,
        sv.mastery_level, sv.status, sv.total_reviews, sv.total_correct,
        sv.total_incorrect, sv.next_review_at, sv.last_reviewed_at,
        sv.review_priority, sv.consecutive_incorrect, sv.recent_errors, sv.acquired_at,
        sv.review_interval_days, sv.ease_factor,
        vf.past_simple, vf.past_participle, vf.present_participle, vf.third_person_singular, vf.base_form
      FROM vocabulary_items vi
      JOIN student_vocabulary sv ON sv.vocabulary_item_id = vi.id AND sv.student_id = $2
      LEFT JOIN verb_forms vf ON vf.vocabulary_item_id = vi.id
      WHERE vi.id = $1 AND vi.student_id = $2
    `, [id, sid]);

    if (!vocabRes.rows[0]) return res.status(404).json({ error: 'Vocabulary item not found' });
    const vocab = vocabRes.rows[0];

    const meaningsRes = await db.query(
      'SELECT * FROM meanings WHERE vocabulary_item_id = $1 ORDER BY sort_order', [id]
    );

    const contextsRes = await db.query(`
      SELECT c.*,
        cm.mastery_level as context_mastery, cm.status as context_status,
        cm.total_reviews as ctx_reviews, cm.total_correct as ctx_correct
      FROM contexts c
      LEFT JOIN context_mastery cm ON cm.context_id = c.id AND cm.student_id = $2
      WHERE c.vocabulary_item_id = $1 AND c.student_id = $2
      ORDER BY c.id
    `, [id, sid]);

    const sentencesRes = await db.query(`
      SELECT * FROM sentences
      WHERE vocabulary_item_id = $1 AND student_id = $2
      ORDER BY created_at DESC LIMIT 20
    `, [id, sid]);

    const tensesRes = await db.query(`
      SELECT * FROM tense_practice
      WHERE vocabulary_item_id = $1 AND student_id = $2
      ORDER BY tense
    `, [id, sid]);

    const reviewsRes = await db.query(`
      SELECT r.*, s.session_type
      FROM reviews r
      LEFT JOIN study_sessions s ON s.id = r.session_id
      WHERE r.vocabulary_item_id = $1 AND r.student_id = $2
      ORDER BY r.reviewed_at DESC LIMIT 10
    `, [id, sid]);

    const errorsRes = await db.query(`
      SELECT error_category, COUNT(*) as count, MAX(occurred_at) as last_occurred
      FROM errors WHERE vocabulary_item_id = $1 AND student_id = $2
      GROUP BY error_category ORDER BY count DESC
    `, [id, sid]);

    res.json({
      ...vocab,
      meanings: meaningsRes.rows,
      contexts: contextsRes.rows,
      sentences: sentencesRes.rows,
      tenses: tensesRes.rows,
      recentReviews: reviewsRes.rows,
      errorSummary: errorsRes.rows,
    });
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// POST /api/vocabulary
router.post('/', async (req, res) => {
  try {
    const sid = req.studentId;
    const {
      word, type = 'verb', level = 'A1', primary_meaning,
      difficulty = 3, is_irregular = false, notes,
      meanings = [], contexts = [], forms = null,
      language_code = 'en',
    } = req.body;

    if (!word) return res.status(400).json({ error: 'word is required' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Palavra pertence ao estudante atual; UNIQUE é (student_id, word, type)
      const vocabRes = await client.query(`
        INSERT INTO vocabulary_items (word, type, level, primary_meaning, difficulty, is_irregular, notes, student_id, language_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (student_id, word, type) WHERE student_id IS NOT NULL DO UPDATE SET
          primary_meaning = EXCLUDED.primary_meaning,
          level = EXCLUDED.level,
          language_code = EXCLUDED.language_code,
          updated_at = NOW()
        RETURNING *
      `, [word.toLowerCase(), type, level, primary_meaning, difficulty, is_irregular, notes, sid, language_code]);

      const vocab = vocabRes.rows[0];

      if (forms) {
        await client.query(`
          INSERT INTO verb_forms (vocabulary_item_id, base_form, past_simple, past_participle, present_participle, third_person_singular)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [vocab.id, word, forms.past_simple, forms.past_participle, forms.present_participle, forms.third_person]);
      }

      for (let i = 0; i < meanings.length; i++) {
        await client.query(`
          INSERT INTO meanings (vocabulary_item_id, meaning_text, language, sort_order)
          VALUES ($1, $2, 'pt', $3) ON CONFLICT DO NOTHING
        `, [vocab.id, meanings[i], i]);
      }

      for (const ctx of contexts) {
        await client.query(`
          INSERT INTO contexts (vocabulary_item_id, student_id, context_name, description, example_structure)
          VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING
        `, [vocab.id, sid, ctx.name, ctx.description, ctx.example]);
      }

      // Vincular somente ao estudante dono
      await client.query(`
        INSERT INTO student_vocabulary (student_id, vocabulary_item_id, mastery_level, status, review_priority, next_review_at)
        VALUES ($1, $2, 0, 'red', 80, NOW())
        ON CONFLICT (student_id, vocabulary_item_id) DO NOTHING
      `, [sid, vocab.id]);

      if (type === 'verb') {
        await client.query(`
          INSERT INTO tense_practice (student_id, vocabulary_item_id, tense, tense_code)
          SELECT $1, $2, t.label, t.code
          FROM (VALUES
            ('Present Simple',             'present_simple'),
            ('Past Simple',                'past_simple'),
            ('Present Perfect',            'present_perfect'),
            ('Present Continuous',         'present_continuous'),
            ('Past Continuous',            'past_continuous'),
            ('Future',                     'future'),
            ('Future with will',           'future_will'),
            ('Going to',                   'going_to'),
            ('Modal constructions',        'modal_constructions'),
            ('Conditionals',               'conditionals')
          ) as t(label, code)
          ON CONFLICT (student_id, vocabulary_item_id, tense_code) DO NOTHING
        `, [sid, vocab.id]);
      }

      await client.query('COMMIT');
      res.status(201).json(vocab);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// PATCH /api/vocabulary/:id
router.patch('/:id', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;
    const { word, type, level, primary_meaning, difficulty, is_irregular, notes, language_code } = req.body;
    const result = await db.query(`
      UPDATE vocabulary_items SET
        word = COALESCE($1, word),
        type = COALESCE($2, type),
        level = COALESCE($3, level),
        primary_meaning = COALESCE($4, primary_meaning),
        difficulty = COALESCE($5, difficulty),
        is_irregular = COALESCE($6, is_irregular),
        notes = COALESCE($7, notes),
        language_code = COALESCE($8, language_code),
        updated_at = NOW()
      WHERE id = $9 AND student_id = $10 RETURNING *
    `, [word, type, level, primary_meaning, difficulty, is_irregular, notes, language_code, id, sid]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// DELETE /api/vocabulary/:id
router.delete('/:id', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;
    // Verificar posse antes de deletar
    const own = await db.query(
      'SELECT id FROM vocabulary_items WHERE id = $1 AND student_id = $2', [id, sid]
    );
    if (!own.rows[0]) return res.status(404).json({ error: 'Not found' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      // ON DELETE CASCADE cuida de student_vocabulary, reviews, errors, sentences, verb_forms, meanings, contexts
      await client.query('DELETE FROM vocabulary_items WHERE id = $1 AND student_id = $2', [id, sid]);
      await client.query('COMMIT');
      res.json({ message: 'Vocabulary item deleted successfully', id: parseInt(id) });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// POST /api/vocabulary/:id/sentences
router.post('/:id/sentences', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;
    // Verificar posse
    const own = await db.query(
      'SELECT id FROM vocabulary_items WHERE id = $1 AND student_id = $2', [id, sid]
    );
    if (!own.rows[0]) return res.status(404).json({ error: 'Not found' });

    const { sentence_text, translation, tense, context_id, notes, source = 'teacher' } = req.body;
    const tenseCode = tenseToCode(tense);
    const result = await db.query(`
      INSERT INTO sentences (vocabulary_item_id, student_id, sentence_text, translation, tense, tense_code, context_id, notes, source)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `, [id, sid, sentence_text, translation, tense, tenseCode, context_id, notes, source]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// PATCH /api/vocabulary/:id/sentences/:sentenceId
router.patch('/:id/sentences/:sentenceId', async (req, res) => {
  try {
    const sid = req.studentId;
    const { sentenceId } = req.params;
    const { sentence_text, translation, tense, notes } = req.body;
    const tenseCode = tense !== undefined ? tenseToCode(tense) : undefined;
    const result = await db.query(`
      UPDATE sentences SET
        sentence_text = COALESCE($1, sentence_text),
        translation   = COALESCE($2, translation),
        tense         = COALESCE($3, tense),
        tense_code    = CASE WHEN $4::varchar IS NOT NULL THEN $4::varchar ELSE tense_code END,
        notes         = COALESCE($5, notes),
        updated_at    = NOW()
      WHERE id = $6 AND student_id = $7 RETURNING *
    `, [sentence_text, translation, tense, tenseCode, notes, sentenceId, sid]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// DELETE /api/vocabulary/:id/sentences/:sentenceId
router.delete('/:id/sentences/:sentenceId', async (req, res) => {
  try {
    const sid = req.studentId;
    const { sentenceId } = req.params;
    const result = await db.query(
      'DELETE FROM sentences WHERE id = $1 AND student_id = $2 RETURNING id',
      [sentenceId, sid]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// POST /api/vocabulary/:id/contexts
router.post('/:id/contexts', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;
    const own = await db.query(
      'SELECT id FROM vocabulary_items WHERE id = $1 AND student_id = $2', [id, sid]
    );
    if (!own.rows[0]) return res.status(404).json({ error: 'Not found' });

    const { context_name, description, example_structure } = req.body;
    const result = await db.query(`
      INSERT INTO contexts (vocabulary_item_id, student_id, context_name, description, example_structure)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [id, sid, context_name, description, example_structure]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

// PATCH /api/vocabulary/:id/meanings/:meaningId
router.patch('/:id/meanings/:meaningId', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id, meaningId } = req.params;
    const { meaning_text } = req.body;
    // Verificar que o meaning pertence a uma palavra do estudante
    const result = await db.query(`
      UPDATE meanings m SET meaning_text = $1
      FROM vocabulary_items vi
      WHERE m.id = $2 AND m.vocabulary_item_id = vi.id AND vi.id = $3 AND vi.student_id = $4
      RETURNING m.*
    `, [meaning_text, meaningId, id, sid]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    sendError(res, err, 'Erro no servidor (Vocabulário)');
  }
});

module.exports = router;
