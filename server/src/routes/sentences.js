const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/sentences?studentId=1&vocabId=5&status=active
router.get('/', async (req, res) => {
  try {
    const { studentId, vocabId, status, q } = req.query;
    let query = `
      SELECT s.*, vi.word, vi.type, c.context_name
      FROM sentences s
      LEFT JOIN vocabulary_items vi ON vi.id = s.vocabulary_item_id
      LEFT JOIN contexts c ON c.id = s.context_id
      WHERE 1=1
    `;
    const params = [];
    let i = 1;
    if (studentId) { query += ` AND (s.student_id = $${i++} OR s.student_id IS NULL)`; params.push(studentId); }
    if (vocabId) { query += ` AND s.vocabulary_item_id = $${i++}`; params.push(vocabId); }
    if (status) { query += ` AND s.status = $${i++}`; params.push(status); }
    if (q) { query += ` AND s.sentence_text ILIKE $${i++}`; params.push(`%${q}%`); }
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
    const { vocabularyItemId, studentId, sentence_text, translation, tense, context_id, notes, source = 'teacher' } = req.body;
    const result = await db.query(`
      INSERT INTO sentences (vocabulary_item_id, student_id, sentence_text, translation, tense, context_id, notes, source)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [vocabularyItemId, studentId, sentence_text, translation, tense, context_id, notes, source]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sentences/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sentence_text, translation, tense, notes, status } = req.body;
    const result = await db.query(`
      UPDATE sentences SET
        sentence_text = COALESCE($1, sentence_text),
        translation = COALESCE($2, translation),
        tense = COALESCE($3, tense),
        notes = COALESCE($4, notes),
        status = COALESCE($5, status),
        updated_at = NOW()
      WHERE id = $6 RETURNING *
    `, [sentence_text, translation, tense, notes, status, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sentences/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sentences WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sentences/paragraphs?studentId=1
router.get('/paragraphs', async (req, res) => {
  try {
    const { studentId } = req.query;
    const result = await db.query(`
      SELECT p.*,
        json_agg(DISTINCT jsonb_build_object('id', vi.id, 'word', vi.word)) 
        FILTER (WHERE vi.id IS NOT NULL) as vocabulary
      FROM paragraphs p
      LEFT JOIN paragraph_vocabulary pv ON pv.paragraph_id = p.id
      LEFT JOIN vocabulary_items vi ON vi.id = pv.vocabulary_item_id
      WHERE p.student_id = $1 OR p.student_id IS NULL
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sentences/paragraphs
router.post('/paragraphs', async (req, res) => {
  try {
    const { studentId, paragraph_text, notes, source = 'teacher', vocabularyIds = [] } = req.body;
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const paraRes = await client.query(`
        INSERT INTO paragraphs (student_id, paragraph_text, notes, source)
        VALUES ($1,$2,$3,$4) RETURNING *
      `, [studentId, paragraph_text, notes, source]);
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
