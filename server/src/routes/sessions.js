const express = require('express');
const router = express.Router();
const db = require('../db/connection');

const SESSION_TYPE_MAP = {
  mixed: 'mixed',
  review: 'review',
  weak: 'weak_items',
  weak_items: 'weak_items',
  new: 'new_acquisition',
  new_acquisition: 'new_acquisition',
  pronunciation: 'pronunciation',
  specific_verb: 'specific_verb',
  custom_quiz: 'custom_quiz',
  green: 'green',
  yellow: 'yellow',
  all: 'all',
};

// POST /api/sessions — iniciar sessão
router.post('/', async (req, res) => {
  try {
    const { studentId, sessionType = 'mixed' } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }
    const normalizedType = SESSION_TYPE_MAP[sessionType] || 'mixed';
    const result = await db.query(`
      INSERT INTO study_sessions (student_id, session_type)
      VALUES ($1, $2) RETURNING *
    `, [studentId, normalizedType]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sessions/:id — finalizar sessão
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await db.query(`
      UPDATE study_sessions SET
        finished_at = NOW(),
        notes = COALESCE($2, notes),
        total_items = (SELECT COUNT(*) FROM reviews WHERE session_id = $1),
        correct_count = (SELECT COUNT(*) FROM reviews WHERE session_id = $1 AND result = 'correct'),
        incorrect_count = (SELECT COUNT(*) FROM reviews WHERE session_id = $1 AND result = 'incorrect')
      WHERE id = $1 RETURNING *
    `, [id, notes]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sessions?studentId=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { studentId, limit = 10 } = req.query;
    const result = await db.query(`
      SELECT ss.*,
        COUNT(r.id) as items_reviewed,
        COUNT(r.id) FILTER (WHERE r.result = 'correct') as correct,
        COUNT(r.id) FILTER (WHERE r.result = 'incorrect') as incorrect,
        ROUND(
          100.0 * COUNT(r.id) FILTER (WHERE r.result = 'correct') /
          NULLIF(COUNT(r.id), 0)
        ) as accuracy_pct
      FROM study_sessions ss
      LEFT JOIN reviews r ON r.session_id = ss.id
      WHERE ss.student_id = $1
      GROUP BY ss.id
      ORDER BY ss.started_at DESC
      LIMIT $2
    `, [studentId, limit]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
