const express = require('express');
const router = express.Router();
const { pool } = require('../db/connection');

// GET /api/tenses  — returns all canonical tenses ordered by sort_order
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT code, lang, label, sort_order FROM tenses ORDER BY sort_order'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;