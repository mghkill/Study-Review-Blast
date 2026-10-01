const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/students
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*,
        COUNT(DISTINCT sv.vocabulary_item_id) as total_vocab,
        COUNT(DISTINCT sv.vocabulary_item_id) FILTER (WHERE sv.status = 'green') as mastered_count,
        COUNT(DISTINCT sv.vocabulary_item_id) FILTER (WHERE sv.status = 'yellow') as learning_count,
        COUNT(DISTINCT sv.vocabulary_item_id) FILTER (WHERE sv.status = 'red') as weak_count,
        COUNT(DISTINCT sv.vocabulary_item_id) FILTER (WHERE sv.next_review_at <= NOW()) as pending_reviews
      FROM students s
      LEFT JOIN student_vocabulary sv ON sv.student_id = s.id
      GROUP BY s.id
      ORDER BY s.name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students
router.post('/', async (req, res) => {
  try {
    const { name, current_level = 'A1' } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const result = await db.query(
      'INSERT INTO students (name, current_level) VALUES ($1, $2) RETURNING *',
      [name, current_level]
    );
    const newStudent = result.rows[0];

    // Vincular automaticamente todos os itens de vocabulário existentes
    await db.query(`
      INSERT INTO student_vocabulary (student_id, vocabulary_item_id, mastery_level, status, review_priority, next_review_at)
      SELECT $1, id, 0, 'red', 80, NOW()
      FROM vocabulary_items
      ON CONFLICT (student_id, vocabulary_item_id) DO NOTHING
    `, [newStudent.id]);

    // Criar registros iniciais de tempos verbais
    await db.query(`
      INSERT INTO tense_practice (student_id, vocabulary_item_id, tense)
      SELECT $1, v.id, t.tense
      FROM vocabulary_items v
      CROSS JOIN (VALUES
        ('Present Simple'), ('Past Simple'), ('Present Perfect'),
        ('Present Continuous'), ('Past Continuous'), ('Future'),
        ('Future with will'), ('Going to'), ('Modal constructions'), ('Conditionals')
      ) as t(tense)
      WHERE v.type = 'verb'
      ON CONFLICT (student_id, vocabulary_item_id, tense) DO NOTHING
    `, [newStudent.id]);

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/students/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, current_level } = req.body;
    const result = await db.query(
      `UPDATE students SET
        name = COALESCE($1, name),
        current_level = COALESCE($2, current_level),
        updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [name, current_level, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
