const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /api/students — lista todos (não requer header, é usada na seleção de estudante)
router.get('/', async (req, res, next) => {
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
    next(err);
  }
});

// GET /api/students/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

const { strictLimiter } = require('../middleware/rateLimiters');

// POST /api/students — cria estudante NOVO, começa com zero palavras (T-026)
router.post('/', strictLimiter, async (req, res, next) => {
  try {
    const { name, current_level = 'A1' } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const result = await db.query(
      'INSERT INTO students (name, current_level) VALUES ($1, $2) RETURNING *',
      [name, current_level]
    );
    // Não vincula vocabulário existente — cada palavra pertence ao seu criador (T-026)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/students/:id
router.patch('/:id', async (req, res, next) => {
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
    next(err);
  }
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // ON DELETE CASCADE em vocabulary_items.student_id cuida de todo o progresso
    await db.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
