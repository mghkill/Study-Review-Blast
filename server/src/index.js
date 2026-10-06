const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middlewares ─────────────────────────────────
app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
app.use('/api/students', require('./routes/students'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/sentences', require('./routes/sentences'));
app.use('/api/tenses',   require('./routes/tenses'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ─── Health check ────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const { pool } = require('./db/connection');
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', time: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: err.message });
  }
});

const { errorHandler } = require('./middleware/errorHandler');

// ─── Error handler ───────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 English Study API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   DB: connected`);
});
