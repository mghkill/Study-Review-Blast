const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { requireStudent } = require('../middleware/requireStudent');
const { tenseToCode } = require('../services/tenses');

router.use(requireStudent);

// GET /api/sentences?vocabId=5&status=active&q=texto
router.get('/', async (req, res) => {
  try {
    const sid = req.studentId;
    const { vocabId, status, q } = req.query;
    let query = `
      SELECT s.*, vi.word, vi.type, c.context_name
      FROM sentences s
      LEFT JOIN vocabulary_items vi ON vi.id = s.vocabulary_item_id AND vi.student_id = $1
      LEFT JOIN contexts c ON c.id = s.context_id AND c.student_id = $1
      WHERE s.student_id = $1
    `;
    const params = [sid];
    let i = 2;
    if (vocabId) { query += ` AND s.vocabulary_item_id = $${i++}`; params.push(vocabId); }
    if (status)  { query += ` AND s.status = $${i++}`;             params.push(status); }
    if (q)       { query += ` AND s.sentence_text ILIKE $${i++}`;  params.push(`%${q}%`); }
    query += ' ORDER BY s.created_at DESC LIMIT 50';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sentences
router.post('/', async (req, res) => {
  try {
    const sid = req.studentId;
    // studentId vindo do corpo é ignorado — usamos req.studentId
    const { vocabularyItemId, sentence_text, translation, tense, context_id, notes, source = 'teacher' } = req.body;

    // Verificar que a palavra pertence ao estudante
    const own = await db.query(
      'SELECT id FROM vocabulary_items WHERE id = $1 AND student_id = $2', [vocabularyItemId, sid]
    );
    if (!own.rows[0]) return res.status(404).json({ error: 'Vocabulary item not found for this student' });

    const tenseCode = tenseToCode(tense);
    const result = await db.query(`
      INSERT INTO sentences (vocabulary_item_id, student_id, sentence_text, translation, tense, tense_code, context_id, notes, source)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `, [vocabularyItemId, sid, sentence_text, translation, tense, tenseCode, context_id, notes, source]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sentences/:id
router.patch('/:id', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;
    const { sentence_text, translation, tense, notes, status } = req.body;
    const tenseCode = tense !== undefined ? tenseToCode(tense) : undefined;
    const result = await db.query(`
      UPDATE sentences SET
        sentence_text = COALESCE($1, sentence_text),
        translation = COALESCE($2, translation),
        tense = COALESCE($3, tense),
        tense_code = CASE WHEN $4::varchar IS NOT NULL THEN $4::varchar ELSE tense_code END,
        notes = COALESCE($5, notes),
        status = COALESCE($6, status),
        updated_at = NOW()
      WHERE id = $7 AND student_id = $8 RETURNING *
    `, [sentence_text, translation, tense, tenseCode, notes, status, id, sid]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sentences/:id
router.delete('/:id', async (req, res) => {
  try {
    const sid = req.studentId;
    const result = await db.query(
      'DELETE FROM sentences WHERE id = $1 AND student_id = $2 RETURNING id',
      [req.params.id, sid]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sentences/paragraphs
router.get('/paragraphs', async (req, res) => {
  try {
    const sid = req.studentId;
    const result = await db.query(`
      SELECT p.*,
        json_agg(DISTINCT jsonb_build_object('id', vi.id, 'word', vi.word))
        FILTER (WHERE vi.id IS NOT NULL) as vocabulary
      FROM paragraphs p
      LEFT JOIN paragraph_vocabulary pv ON pv.paragraph_id = p.id
      LEFT JOIN vocabulary_items vi ON vi.id = pv.vocabulary_item_id AND vi.student_id = $1
      WHERE p.student_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [sid]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sentences/paragraphs
router.post('/paragraphs', async (req, res) => {
  try {
    const sid = req.studentId;
    const { paragraph_text, notes, source = 'teacher', vocabularyIds = [] } = req.body;
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const paraRes = await client.query(`
        INSERT INTO paragraphs (student_id, paragraph_text, notes, source)
        VALUES ($1,$2,$3,$4) RETURNING *
      `, [sid, paragraph_text, notes, source]);
      const para = paraRes.rows[0];
      for (const vid of vocabularyIds) {
        await client.query(`
          INSERT INTO paragraph_vocabulary (paragraph_id, vocabulary_item_id)
          VALUES ($1,$2) ON CONFLICT DO NOTHING
        `, [para.id, vid]);
      }
      await client.query('COMMIT');
      res.status(201).json(para);
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

module.exports = router;
