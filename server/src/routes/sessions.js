const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { requireStudent } = require('../middleware/requireStudent');

const SESSION_TYPE_MAP = {
  mixed: 'mixed', review: 'review',
  weak: 'weak_items', weak_items: 'weak_items',
  new: 'new_acquisition', new_acquisition: 'new_acquisition',
  pronunciation: 'pronunciation', specific_verb: 'specific_verb',
  custom_quiz: 'custom_quiz', green: 'green', yellow: 'yellow', all: 'all',
};

router.use(requireStudent);

// POST /api/sessions
router.post('/', async (req, res) => {
  try {
    const sid = req.studentId;
    const { sessionType = 'mixed' } = req.body;
    const normalizedType = SESSION_TYPE_MAP[sessionType] || 'mixed';
    const result = await db.query(`
      INSERT INTO study_sessions (student_id, session_type)
      VALUES ($1, $2) RETURNING *
    `, [sid, normalizedType]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/sessions/:id
router.patch('/:id', async (req, res) => {
  try {
    const sid = req.studentId;
    const { id } = req.params;
    const { notes } = req.body;

    // Verificar que a sessão pertence ao estudante
    const own = await db.query(
      'SELECT id FROM study_sessions WHERE id = $1 AND student_id = $2', [id, sid]
    );
    if (!own.rows[0]) return res.status(404).json({ error: 'Session not found' });

    const result = await db.query(`
      UPDATE study_sessions SET
        finished_at = NOW(),
        notes = COALESCE($2, notes),
        total_items = (SELECT COUNT(*) FROM reviews WHERE session_id = $1),
        correct_count = (SELECT COUNT(*) FROM reviews WHERE session_id = $1 AND result = 'correct'),
        incorrect_count = (SELECT COUNT(*) FROM reviews WHERE session_id = $1 AND result = 'incorrect')
      WHERE id = $1 AND student_id = $3 RETURNING *
    `, [id, notes, sid]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sessions?limit=10
router.get('/', async (req, res) => {
  try {
    const sid = req.studentId;
    const { limit = 10 } = req.query;
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
    `, [sid, limit]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
