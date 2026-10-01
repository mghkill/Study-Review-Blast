const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { requireStudent } = require('../middleware/requireStudent');

router.use(requireStudent);

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const sid = req.studentId;

    const statsRes = await db.query(`
      SELECT
        COUNT(*) as total_vocab,
        COUNT(*) FILTER (WHERE sv.status = 'green') as mastered,
        COUNT(*) FILTER (WHERE sv.status = 'yellow') as learning,
        COUNT(*) FILTER (WHERE sv.status = 'red') as weak,
        COUNT(*) FILTER (WHERE sv.total_reviews = 0) as not_started,
        COUNT(*) FILTER (WHERE sv.next_review_at <= NOW() AND sv.total_reviews > 0) as pending_reviews,
        COUNT(*) FILTER (WHERE vi.type = 'verb') as total_verbs,
        COUNT(*) FILTER (WHERE vi.type = 'verb' AND sv.mastery_level >= 4) as mastered_verbs,
        AVG(sv.mastery_level) as avg_mastery
      FROM student_vocabulary sv
      JOIN vocabulary_items vi ON vi.id = sv.vocabulary_item_id AND vi.student_id = $1
      WHERE sv.student_id = $1
    `, [sid]);

    const sentencesRes = await db.query(`
      SELECT COUNT(*) as total_sentences,
        COUNT(*) FILTER (WHERE s.status = 'mastered') as mastered_sentences,
        COUNT(*) FILTER (WHERE s.status = 'active') as active_sentences
      FROM sentences s
      WHERE s.student_id = $1
    `, [sid]);

    const priorityRes = await db.query(`
      SELECT vi.id, vi.word, vi.type, vi.level,
        sv.mastery_level, sv.status, sv.review_priority,
        sv.total_incorrect, sv.total_reviews, sv.consecutive_incorrect,
        sv.next_review_at
      FROM student_vocabulary sv
      JOIN vocabulary_items vi ON vi.id = sv.vocabulary_item_id AND vi.student_id = $1
      WHERE sv.student_id = $1
      ORDER BY sv.review_priority DESC, sv.next_review_at ASC
      LIMIT 10
    `, [sid]);

    const sessionsRes = await db.query(`
      SELECT ss.*,
        COUNT(r.id) as items_reviewed,
        COUNT(r.id) FILTER (WHERE r.result = 'correct') as correct,
        COUNT(r.id) FILTER (WHERE r.result = 'incorrect') as incorrect
      FROM study_sessions ss
      LEFT JOIN reviews r ON r.session_id = ss.id
      WHERE ss.student_id = $1
      GROUP BY ss.id
      ORDER BY ss.started_at DESC
      LIMIT 7
    `, [sid]);

    const errorsRes = await db.query(`
      SELECT error_category, COUNT(*) as count
      FROM errors
      WHERE student_id = $1 AND occurred_at >= NOW() - INTERVAL '30 days'
      GROUP BY error_category
      ORDER BY count DESC
    `, [sid]);

    const weeklyRes = await db.query(`
      SELECT
        DATE_TRUNC('week', r.reviewed_at) as week,
        COUNT(*) as reviews,
        COUNT(*) FILTER (WHERE r.result = 'correct') as correct,
        COUNT(DISTINCT r.vocabulary_item_id) as unique_words
      FROM reviews r
      WHERE r.student_id = $1 AND r.reviewed_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', r.reviewed_at)
      ORDER BY week
    `, [sid]);

    const levelRes = await db.query(`
      SELECT vi.level,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE sv.status = 'green') as mastered,
        COUNT(*) FILTER (WHERE sv.status = 'yellow') as learning,
        COUNT(*) FILTER (WHERE sv.status = 'red') as weak
      FROM student_vocabulary sv
      JOIN vocabulary_items vi ON vi.id = sv.vocabulary_item_id AND vi.student_id = $1
      WHERE sv.student_id = $1
      GROUP BY vi.level
      ORDER BY vi.level
    `, [sid]);

    const studentRes = await db.query('SELECT * FROM students WHERE id = $1', [sid]);

    res.json({
      student: studentRes.rows[0],
      stats: statsRes.rows[0],
      sentences: sentencesRes.rows[0],
      priorityItems: priorityRes.rows,
      recentSessions: sessionsRes.rows,
      errorsByCategory: errorsRes.rows,
      weeklyProgress: weeklyRes.rows,
      byLevel: levelRes.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
