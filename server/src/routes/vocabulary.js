const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/vocabulary?studentId=1&type=verb&level=B1&status=red&q=run
router.get('/', async (req, res) => {
  try {
    const { studentId, type, level, status, q } = req.query;

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
      LEFT JOIN student_vocabulary sv ON sv.vocabulary_item_id = vi.id AND sv.student_id = $1
      LEFT JOIN meanings m ON m.vocabulary_item_id = vi.id
      LEFT JOIN contexts c ON c.vocabulary_item_id = vi.id
      LEFT JOIN verb_forms vf ON vf.vocabulary_item_id = vi.id
      WHERE 1=1
    `;

    const params = [studentId || null];
    let paramIndex = 2;

    if (type) { query += ` AND vi.type = $${paramIndex++}`; params.push(type); }
    if (level) { query += ` AND vi.level = $${paramIndex++}`; params.push(level); }
    if (status) { query += ` AND sv.status = $${paramIndex++}`; params.push(status); }
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
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vocabulary/:id?studentId=1
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query;

    const vocabRes = await db.query(`
      SELECT vi.*,
        sv.mastery_level, sv.status, sv.total_reviews, sv.total_correct,
        sv.total_incorrect, sv.next_review_at, sv.last_reviewed_at,
        sv.review_priority, sv.consecutive_incorrect, sv.recent_errors, sv.acquired_at,
        sv.review_interval_days, sv.ease_factor,
        vf.past_simple, vf.past_participle, vf.present_participle, vf.third_person_singular, vf.base_form
      FROM vocabulary_items vi
      LEFT JOIN student_vocabulary sv ON sv.vocabulary_item_id = vi.id AND sv.student_id = $2
      LEFT JOIN verb_forms vf ON vf.vocabulary_item_id = vi.id
      WHERE vi.id = $1
    `, [id, studentId || null]);

    if (!vocabRes.rows[0]) return res.status(404).json({ error: 'Vocabulary item not found' });
    const vocab = vocabRes.rows[0];

    // Significados
    const meaningsRes = await db.query(
      'SELECT * FROM meanings WHERE vocabulary_item_id = $1 ORDER BY sort_order', [id]
    );

    // Contextos com domínio
    const contextsRes = await db.query(`
      SELECT c.*,
        cm.mastery_level as context_mastery, cm.status as context_status,
        cm.total_reviews as ctx_reviews, cm.total_correct as ctx_correct
      FROM contexts c
      LEFT JOIN context_mastery cm ON cm.context_id = c.id AND cm.student_id = $2
      WHERE c.vocabulary_item_id = $1
      ORDER BY c.id
    `, [id, studentId || null]);

    // Frases
    const sentencesRes = await db.query(`
      SELECT * FROM sentences WHERE vocabulary_item_id = $1 ORDER BY created_at DESC LIMIT 20
    `, [id]);

    // Prática por tempo verbal
    const tensesRes = await db.query(`
      SELECT * FROM tense_practice 
      WHERE vocabulary_item_id = $1 AND student_id = $2
      ORDER BY tense
    `, [id, studentId || null]);

    // Últimas revisões
    const reviewsRes = await db.query(`
      SELECT r.*, s.session_type
      FROM reviews r
      LEFT JOIN study_sessions s ON s.id = r.session_id
      WHERE r.vocabulary_item_id = $1 AND r.student_id = $2
      ORDER BY r.reviewed_at DESC LIMIT 10
    `, [id, studentId || null]);

    // Erros registrados
    const errorsRes = await db.query(`
      SELECT error_category, COUNT(*) as count, MAX(occurred_at) as last_occurred
      FROM errors WHERE vocabulary_item_id = $1 AND student_id = $2
      GROUP BY error_category ORDER BY count DESC
    `, [id, studentId || null]);

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
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary
router.post('/', async (req, res) => {
  try {
    const {
      word, type = 'verb', level = 'A1', primary_meaning,
      difficulty = 3, is_irregular = false, notes,
      studentId,
      meanings = [], contexts = [], forms = null,
    } = req.body;

    if (!word) return res.status(400).json({ error: 'word is required' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const vocabRes = await client.query(`
        INSERT INTO vocabulary_items (word, type, level, primary_meaning, difficulty, is_irregular, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (word, type) DO UPDATE SET
          primary_meaning = EXCLUDED.primary_meaning,
          level = EXCLUDED.level,
          updated_at = NOW()
        RETURNING *
      `, [word.toLowerCase(), type, level, primary_meaning, difficulty, is_irregular, notes]);

      const vocab = vocabRes.rows[0];

      // Formas verbais
      if (forms) {
        await client.query(`
          INSERT INTO verb_forms (vocabulary_item_id, base_form, past_simple, past_participle, present_participle, third_person_singular)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [vocab.id, word, forms.past_simple, forms.past_participle, forms.present_participle, forms.third_person]);
      }

      // Significados
      for (let i = 0; i < meanings.length; i++) {
        await client.query(`
          INSERT INTO meanings (vocabulary_item_id, meaning_text, language, sort_order)
          VALUES ($1, $2, 'pt', $3) ON CONFLICT DO NOTHING
        `, [vocab.id, meanings[i], i]);
      }

      // Contextos
      for (const ctx of contexts) {
        await client.query(`
          INSERT INTO contexts (vocabulary_item_id, context_name, description, example_structure)
          VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING
        `, [vocab.id, ctx.name, ctx.description, ctx.example]);
      }

      // Associar aos estudantes (ao estudante atual e garantir que todos os estudantes tenham acesso)
      await client.query(`
        INSERT INTO student_vocabulary (student_id, vocabulary_item_id, mastery_level, status, review_priority, next_review_at)
        SELECT id, $1, 0, 'red', 80, NOW()
        FROM students
        ON CONFLICT (student_id, vocabulary_item_id) DO NOTHING
      `, [vocab.id]);

      // Criar registros de tempo verbal para todos os estudantes se for verbo
      if (type === 'verb') {
        await client.query(`
          INSERT INTO tense_practice (student_id, vocabulary_item_id, tense)
          SELECT s.id, $1, t.tense
          FROM students s
          CROSS JOIN (VALUES
            ('Present Simple'), ('Past Simple'), ('Present Perfect'), ('Present Continuous'),
            ('Past Continuous'), ('Future'), ('Future with will'), ('Going to'),
            ('Modal constructions'), ('Conditionals')
          ) as t(tense)
          ON CONFLICT (student_id, vocabulary_item_id, tense) DO NOTHING
        `, [vocab.id]);
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
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/vocabulary/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { word, type, level, primary_meaning, difficulty, is_irregular, notes } = req.body;
    const result = await db.query(`
      UPDATE vocabulary_items SET
        word = COALESCE($1, word),
        type = COALESCE($2, type),
        level = COALESCE($3, level),
        primary_meaning = COALESCE($4, primary_meaning),
        difficulty = COALESCE($5, difficulty),
        is_irregular = COALESCE($6, is_irregular),
        notes = COALESCE($7, notes),
        updated_at = NOW()
      WHERE id = $8 RETURNING *
    `, [word, type, level, primary_meaning, difficulty, is_irregular, notes, id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/vocabulary/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE reviews SET context_practiced = NULL WHERE vocabulary_item_id = $1', [id]);
      await client.query('DELETE FROM sentences WHERE vocabulary_item_id = $1', [id]);
      await client.query('DELETE FROM vocabulary_items WHERE id = $1', [id]);
      await client.query('COMMIT');
      res.json({ message: 'Vocabulary item deleted successfully', id: parseInt(id) });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary/:id/sentences
router.post('/:id/sentences', async (req, res) => {
  try {
    const { id } = req.params;
    const { sentence_text, translation, tense, context_id, notes, source = 'teacher', studentId } = req.body;
    const result = await db.query(`
      INSERT INTO sentences (vocabulary_item_id, student_id, sentence_text, translation, tense, context_id, notes, source)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [id, studentId, sentence_text, translation, tense, context_id, notes, source]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/vocabulary/:id/sentences/:sentenceId
router.patch('/:id/sentences/:sentenceId', async (req, res) => {
  try {
    const { sentenceId } = req.params;
    const { sentence_text, translation, tense, notes } = req.body;
    const result = await db.query(`
      UPDATE sentences SET
        sentence_text = COALESCE($1, sentence_text),
        translation   = COALESCE($2, translation),
        tense         = COALESCE($3, tense),
        notes         = COALESCE($4, notes),
        updated_at    = NOW()
      WHERE id = $5 RETURNING *
    `, [sentence_text, translation, tense, notes, sentenceId]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/vocabulary/:id/sentences/:sentenceId
router.delete('/:id/sentences/:sentenceId', async (req, res) => {
  try {
    const { sentenceId } = req.params;
    await db.query('DELETE FROM sentences WHERE id = $1', [sentenceId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vocabulary/:id/contexts
router.post('/:id/contexts', async (req, res) => {
  try {
    const { id } = req.params;
    const { context_name, description, example_structure } = req.body;
    const result = await db.query(`
      INSERT INTO contexts (vocabulary_item_id, context_name, description, example_structure)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [id, context_name, description, example_structure]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/vocabulary/:id/meanings/:meaningId
router.patch('/:id/meanings/:meaningId', async (req, res) => {
  try {
    const { meaningId } = req.params;
    const { meaning_text } = req.body;
    const result = await db.query(
      'UPDATE meanings SET meaning_text = $1 WHERE id = $2 RETURNING *',
      [meaning_text, meaningId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
