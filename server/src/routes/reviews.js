const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const {
  calculatePriority,
  calculateNextInterval,
  updateMasteryLevel,
  selectStudyItems,
  generateAuditText,
} = require('../services/srs');

// GET /api/reviews/queue?studentId=1&mode=mixed&limit=10&vocabId=3&level=B1&status=red
// Retorna os itens para a próxima sessão de estudo com garantia de prática contínua
router.get('/queue', async (req, res) => {
  try {
    const { studentId, mode = 'mixed', limit = 13, vocabId, level, status } = req.query;
    if (!studentId) return res.status(400).json({ error: 'studentId required' });

    let query = `
      SELECT 
        sv.*,
        vi.id as vocabulary_item_id,
        vi.word, vi.type, vi.level, vi.primary_meaning, vi.difficulty, vi.is_irregular,
        sv.mastery_level, sv.status, sv.total_reviews, sv.total_correct, sv.total_incorrect,
        sv.next_review_at, sv.last_reviewed_at, sv.consecutive_incorrect, sv.recent_errors,
        sv.review_interval_days, sv.ease_factor,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('text', m.meaning_text))
          FILTER (WHERE m.id IS NOT NULL), '[]'
        ) as meanings,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.context_name))
          FILTER (WHERE c.id IS NOT NULL), '[]'
        ) as contexts,
        (
          SELECT json_agg(row_to_json(s.*))
          FROM sentences s
          WHERE s.vocabulary_item_id = vi.id
          LIMIT 3
        ) as sample_sentences
      FROM student_vocabulary sv
      JOIN vocabulary_items vi ON vi.id = sv.vocabulary_item_id
      LEFT JOIN meanings m ON m.vocabulary_item_id = vi.id
      LEFT JOIN contexts c ON c.vocabulary_item_id = vi.id
      WHERE sv.student_id = $1
    `;

    const params = [studentId];
    let pIdx = 2;

    if (vocabId) {
      query += ` AND vi.id = $${pIdx++}`;
      params.push(vocabId);
    }
    if (level && level !== 'all') {
      query += ` AND vi.level = $${pIdx++}`;
      params.push(level);
    }
    if (status && status !== 'all') {
      query += ` AND sv.status = $${pIdx++}`;
      params.push(status);
    }

    query += ` GROUP BY sv.id, vi.id`;

    const result = await db.query(query, params);
    let items = result.rows;

    // Aplicar filtros de modo se especificado
    if (mode === 'weak' || mode === 'weak_items') {
      const filtered = items.filter(i => i.status === 'red' || (i.consecutive_incorrect || 0) >= 1);
      if (filtered.length > 0) items = filtered;
    } else if (mode === 'yellow' || mode === 'learning') {
      const filtered = items.filter(i => i.status === 'yellow');
      if (filtered.length > 0) items = filtered;
    } else if (mode === 'green' || mode === 'mastered') {
      const filtered = items.filter(i => i.status === 'green');
      if (filtered.length > 0) items = filtered;
    } else if (mode === 'new' || mode === 'new_acquisition') {
      const filtered = items.filter(i => (i.total_reviews || 0) === 0);
      if (filtered.length > 0) items = filtered;
    } else if (mode === 'review') {
      const filtered = items.filter(i => new Date(i.next_review_at) <= new Date());
      // Se não houver itens vencidos exatamente hoje, pega os que mais precisam de revisão
      if (filtered.length > 0) items = filtered;
    }

    // Selecionar itens com lógica de repetição intercalada e preenchimento contínuo
    const selected = selectStudyItems(items, {
      newCount: 3,
      reviewCount: 7,
      reinforceCount: 3,
      totalMax: parseInt(limit) || 13,
    });

    // Adicionar textos de auditoria
    const withAudit = selected.map(item => ({
      ...item,
      audit_lines: generateAuditText(item.selection_reason || {}, item),
    }));

    res.json({
      items: withAudit,
      total: withAudit.length,
      mode,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews
// Registra o resultado de uma revisão e atualiza o SRS
router.post('/', async (req, res) => {
  try {
    const {
      studentId, vocabularyItemId, sessionId,
      result: reviewResult,  // correct | partial | incorrect
      difficultyRating,       // easy | medium | hard
      meaningCorrect, grammarCorrect, sentenceCorrect,
      pronunciationCorrect, pronunciationRating,
      studentAnswer, teacherNotes,
      tensePracticed, contextPracticed,
      errorCategories = [],
      selectionReason,
      sentenceId,
    } = req.body;

    if (!studentId || !vocabularyItemId || !reviewResult) {
      return res.status(400).json({ error: 'studentId, vocabularyItemId, result required' });
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Buscar estado atual do item
      const svRes = await client.query(`
        SELECT * FROM student_vocabulary
        WHERE student_id = $1 AND vocabulary_item_id = $2
      `, [studentId, vocabularyItemId]);

      let sv = svRes.rows[0];

      // Se não existe, criar
      if (!sv) {
        const newSv = await client.query(`
          INSERT INTO student_vocabulary (student_id, vocabulary_item_id)
          VALUES ($1, $2) RETURNING *
        `, [studentId, vocabularyItemId]);
        sv = newSv.rows[0];
      }

      // Calcular novo intervalo
      const { newInterval, newEaseFactor } = calculateNextInterval(sv, reviewResult, sv.ease_factor);

      // Atualizar contadores
      const isCorrect = reviewResult === 'correct';
      const isIncorrect = reviewResult === 'incorrect';

      const newConsecutiveCorrect = isCorrect ? (sv.consecutive_correct || 0) + 1 : 0;
      const newConsecutiveIncorrect = isIncorrect ? (sv.consecutive_incorrect || 0) + 1 : 0;

      // Atualizar mastery level
      const { newLevel, status } = updateMasteryLevel(
        sv.mastery_level,
        reviewResult,
        newConsecutiveCorrect
      );

      // Calcular nova prioridade
      const updatedSvData = {
        ...sv,
        total_reviews: (sv.total_reviews || 0) + 1,
        total_correct: (sv.total_correct || 0) + (isCorrect ? 1 : 0),
        total_incorrect: (sv.total_incorrect || 0) + (isIncorrect ? 1 : 0),
        consecutive_incorrect: newConsecutiveIncorrect,
        recent_errors: isIncorrect ? (sv.recent_errors || 0) + 1 : Math.max(0, (sv.recent_errors || 0) - 0.5),
        mastery_level: newLevel,
        next_review_at: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
        last_reviewed_at: new Date(),
      };

      const { priority: newPriority } = calculatePriority(updatedSvData);

      // Sanitizar campos opcionais para respeitar constraints do banco
      const validDifficulty = ['easy', 'medium', 'hard'].includes(difficultyRating)
        ? difficultyRating
        : (reviewResult === 'correct' ? 'easy' : reviewResult === 'partial' ? 'medium' : 'hard');

      const validPronunciationRating = ['excellent', 'good', 'needs_improvement', 'very_weak'].includes(pronunciationRating)
        ? pronunciationRating
        : null;

      const cleanTense = tensePracticed && tensePracticed.trim() ? tensePracticed.trim() : null;

      // Atualizar student_vocabulary
      await client.query(`
        UPDATE student_vocabulary SET
          total_reviews = total_reviews + 1,
          total_correct = total_correct + $3,
          total_incorrect = total_incorrect + $4,
          consecutive_correct = $5,
          consecutive_incorrect = $6,
          recent_errors = GREATEST(0, recent_errors + $7),
          mastery_level = $8,
          status = $9,
          review_interval_days = $10,
          ease_factor = $11,
          next_review_at = NOW() + ($10 * INTERVAL '1 day'),
          last_reviewed_at = NOW(),
          review_priority = $12,
          updated_at = NOW()
        WHERE student_id = $1 AND vocabulary_item_id = $2
      `, [
        studentId, vocabularyItemId,
        isCorrect ? 1 : 0,      // $3
        isIncorrect ? 1 : 0,    // $4
        newConsecutiveCorrect,   // $5
        newConsecutiveIncorrect, // $6
        isIncorrect ? 1 : -1,   // $7 recent_errors delta (integer)
        newLevel,                // $8
        status,                  // $9
        newInterval,             // $10
        newEaseFactor,           // $11
        newPriority,             // $12
      ]);

      // Registrar revisão
      const reviewRes = await client.query(`
        INSERT INTO reviews (
          student_id, vocabulary_item_id, session_id, sentence_id,
          result, difficulty_rating,
          meaning_correct, grammar_correct, sentence_correct,
          pronunciation_correct, pronunciation_rating,
          student_answer, teacher_notes,
          tense_practiced, context_practiced,
          error_categories, selection_reason,
          priority_before, priority_after,
          interval_before, interval_after
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        RETURNING *
      `, [
        studentId, vocabularyItemId, sessionId || null, sentenceId || null,
        reviewResult, validDifficulty,
        meaningCorrect ?? null, grammarCorrect ?? null, sentenceCorrect ?? null,
        pronunciationCorrect ?? null, validPronunciationRating,
        studentAnswer || null, teacherNotes || null,
        cleanTense, contextPracticed || null,
        Array.isArray(errorCategories) ? errorCategories : [], selectionReason ? JSON.stringify(selectionReason) : null,
        sv.review_priority, newPriority,
        sv.review_interval_days, newInterval,
      ]);

      const review = reviewRes.rows[0];

      // Registrar erros específicos
      for (const category of errorCategories) {
        await client.query(`
          INSERT INTO errors (review_id, student_id, vocabulary_item_id, error_category, tense)
          VALUES ($1, $2, $3, $4, $5)
        `, [review.id, studentId, vocabularyItemId, category, tensePracticed]);
      }

      // Registrar prática de pronúncia se informada
      if (pronunciationCorrect !== undefined) {
        await client.query(`
          INSERT INTO pronunciation_practice (student_id, vocabulary_item_id, sentence_id, is_correct, rating, teacher_notes)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [studentId, vocabularyItemId, sentenceId, pronunciationCorrect, pronunciationRating, teacherNotes]);
      }

      // Atualizar prática por tempo verbal se informado
      if (tensePracticed) {
        await client.query(`
          INSERT INTO tense_practice (student_id, vocabulary_item_id, tense, total_reviews, total_correct, total_incorrect, mastery_level, status, last_practiced_at)
          VALUES ($1, $2, $3, 1, $4, $5, $6, $7, NOW())
          ON CONFLICT (student_id, vocabulary_item_id, tense) DO UPDATE SET
            total_reviews = tense_practice.total_reviews + 1,
            total_correct = tense_practice.total_correct + EXCLUDED.total_correct,
            total_incorrect = tense_practice.total_incorrect + EXCLUDED.total_incorrect,
            mastery_level = CASE
              WHEN (tense_practice.total_correct + EXCLUDED.total_correct)::float /
                   NULLIF(tense_practice.total_reviews + 1, 0) >= 0.8 THEN 4
              WHEN (tense_practice.total_correct + EXCLUDED.total_correct)::float /
                   NULLIF(tense_practice.total_reviews + 1, 0) >= 0.5 THEN 3
              ELSE 1
            END,
            status = CASE
              WHEN (tense_practice.total_correct + EXCLUDED.total_correct)::float /
                   NULLIF(tense_practice.total_reviews + 1, 0) >= 0.75 THEN 'green'
              WHEN (tense_practice.total_correct + EXCLUDED.total_correct)::float /
                   NULLIF(tense_practice.total_reviews + 1, 0) >= 0.4 THEN 'yellow'
              ELSE 'red'
            END,
            last_practiced_at = NOW(),
            updated_at = NOW()
        `, [
          studentId, vocabularyItemId, tensePracticed,
          isCorrect ? 1 : 0, isIncorrect ? 1 : 0,
          isCorrect ? 4 : 1, isCorrect ? 'green' : 'red',
        ]);
      }

      // Atualizar status das sentenças do verbo
      if (isCorrect) {
        await client.query(`
          UPDATE sentences SET status = 'mastered', updated_at = NOW()
          WHERE vocabulary_item_id = $1 AND (student_id = $2 OR student_id IS NULL)
        `, [vocabularyItemId, studentId]);
      } else if (isIncorrect) {
        await client.query(`
          UPDATE sentences SET status = 'active', updated_at = NOW()
          WHERE vocabulary_item_id = $1 AND (student_id = $2 OR student_id IS NULL)
        `, [vocabularyItemId, studentId]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        review,
        updatedItem: {
          mastery_level: newLevel,
          status,
          review_priority: newPriority,
          next_review_at: updatedSvData.next_review_at,
          review_interval_days: newInterval,
        },
      });
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

// GET /api/reviews/history?studentId=1&vocabId=5&limit=20
router.get('/history', async (req, res) => {
  try {
    const { studentId, vocabId, limit = 20 } = req.query;
    let query = `
      SELECT r.*, vi.word, vi.type
      FROM reviews r
      JOIN vocabulary_items vi ON vi.id = r.vocabulary_item_id
      WHERE r.student_id = $1
    `;
    const params = [studentId];
    if (vocabId) { query += ` AND r.vocabulary_item_id = $2`; params.push(vocabId); }
    query += ` ORDER BY r.reviewed_at DESC LIMIT ${parseInt(limit)}`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews/errors?studentId=1
router.get('/errors', async (req, res) => {
  try {
    const { studentId } = req.query;
    const result = await db.query(`
      SELECT 
        e.error_category,
        COUNT(*) as total_count,
        COUNT(DISTINCT e.vocabulary_item_id) as distinct_words,
        MAX(e.occurred_at) as last_occurred,
        json_agg(DISTINCT vi.word) FILTER (WHERE vi.word IS NOT NULL) as words
      FROM errors e
      JOIN vocabulary_items vi ON vi.id = e.vocabulary_item_id
      WHERE e.student_id = $1
      GROUP BY e.error_category
      ORDER BY total_count DESC
    `, [studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/student-sentence
// Registrar frase produzida pelo aluno
router.post('/student-sentence', async (req, res) => {
  try {
    const {
      studentId, vocabularyItemId, sentenceText, context, tense,
      teacherResult, teacherNotes, pronunciationRating,
      grammarRating, meaningRating, naturalnessRating, vocabularyRating,
      errorCategories = [],
    } = req.body;

    const result = await db.query(`
      INSERT INTO student_sentences (
        student_id, vocabulary_item_id, sentence_text, context, tense,
        teacher_result, teacher_notes, pronunciation_rating,
        grammar_rating, meaning_rating, naturalness_rating, vocabulary_rating,
        error_categories
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    `, [
      studentId, vocabularyItemId, sentenceText, context, tense,
      teacherResult || 'not_evaluated', teacherNotes, pronunciationRating,
      grammarRating, meaningRating, naturalnessRating, vocabularyRating,
      errorCategories,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
