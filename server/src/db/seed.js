const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { pool } = require('./connection');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // =====================================================
    // ESTUDANTE PADRÃO
    // =====================================================
    const studentRes = await pool.query(`
      INSERT INTO students (name, current_level)
      VALUES ('Filipe', 'B1')
      ON CONFLICT DO NOTHING
      RETURNING id
    `);
    
    let studentId;
    if (studentRes.rows.length > 0) {
      studentId = studentRes.rows[0].id;
    } else {
      const s = await pool.query("SELECT id FROM students WHERE name = 'Filipe' LIMIT 1");
      studentId = s.rows[0].id;
    }
    console.log(`✅ Estudante criado: Filipe (ID: ${studentId})`);

    // =====================================================
    // VOCABULÁRIO SEED
    // =====================================================
    const verbs = [
      {
        word: 'avoid',
        type: 'verb',
        level: 'B1',
        primary_meaning: 'evitar',
        difficulty: 3,
        is_irregular: false,
        meanings: ['evitar', 'esquivar-se de', 'abster-se de'],
        contexts: [
          { name: 'avoid people', description: 'evitar pessoas', example: 'avoid someone' },
          { name: 'avoid problems', description: 'evitar problemas', example: 'avoid trouble' },
          { name: 'avoid doing something', description: 'evitar fazer algo', example: 'avoid + gerund' },
          { name: 'avoid conflict', description: 'evitar conflito', example: 'avoid confrontation' },
        ],
        sentences: [
          { text: 'I avoid unnecessary arguments at work.', tense: 'Present Simple' },
          { text: 'She avoided eye contact during the meeting.', tense: 'Past Simple' },
          { text: 'He has been avoiding the topic for weeks.', tense: 'Present Perfect Continuous' },
          { text: 'If you want to avoid problems, check the instructions first.', tense: 'Conditional' },
        ],
      },
      {
        word: 'run',
        type: 'verb',
        level: 'A1',
        primary_meaning: 'correr / executar / gerenciar',
        difficulty: 2,
        is_irregular: true,
        forms: { past_simple: 'ran', past_participle: 'run', present_participle: 'running', third_person: 'runs' },
        meanings: ['correr', 'executar', 'gerenciar', 'funcionar'],
        contexts: [
          { name: 'physical movement', description: 'correr fisicamente', example: 'run every morning' },
          { name: 'manage/operate', description: 'gerenciar / operar', example: 'run a company' },
          { name: 'run into someone', description: 'encontrar alguém por acaso', example: 'run into a friend' },
          { name: 'program running', description: 'programa/sistema funcionando', example: 'the program is running' },
        ],
        sentences: [
          { text: 'I run every morning before breakfast.', tense: 'Present Simple' },
          { text: 'She runs a small business from home.', tense: 'Present Simple' },
          { text: 'He ran into an old friend at the coffee shop.', tense: 'Past Simple' },
          { text: 'The program has been running for three hours.', tense: 'Present Perfect Continuous' },
        ],
      },
      {
        word: 'make',
        type: 'verb',
        level: 'A1',
        primary_meaning: 'fazer / criar / tornar',
        difficulty: 2,
        is_irregular: true,
        forms: { past_simple: 'made', past_participle: 'made', present_participle: 'making', third_person: 'makes' },
        meanings: ['fazer', 'criar', 'produzir', 'tornar', 'forçar'],
        contexts: [
          { name: 'make a decision', description: 'tomar uma decisão', example: 'make a decision' },
          { name: 'make a mistake', description: 'cometer um erro', example: 'make a mistake' },
          { name: 'make progress', description: 'fazer progresso', example: 'make progress' },
          { name: 'make someone do', description: 'fazer alguém fazer algo', example: 'make + object + infinitive' },
        ],
        sentences: [
          { text: 'I made a big mistake at work today.', tense: 'Past Simple' },
          { text: 'She makes excellent coffee every morning.', tense: 'Present Simple' },
          { text: 'We have made significant progress this week.', tense: 'Present Perfect' },
          { text: 'The noise made it difficult to concentrate.', tense: 'Past Simple' },
        ],
      },
      {
        word: 'take',
        type: 'verb',
        level: 'A1',
        primary_meaning: 'pegar / levar / tomar',
        difficulty: 2,
        is_irregular: true,
        forms: { past_simple: 'took', past_participle: 'taken', present_participle: 'taking', third_person: 'takes' },
        meanings: ['pegar', 'levar', 'tomar', 'aceitar', 'necessitar'],
        contexts: [
          { name: 'take time', description: 'levar tempo', example: 'it takes time' },
          { name: 'take a break', description: 'fazer uma pausa', example: 'take a break' },
          { name: 'take responsibility', description: 'assumir responsabilidade', example: 'take responsibility' },
          { name: 'take an exam', description: 'fazer uma prova', example: 'take a test' },
        ],
        sentences: [
          { text: 'It takes about 30 minutes to get there.', tense: 'Present Simple' },
          { text: 'She took a deep breath before speaking.', tense: 'Past Simple' },
          { text: 'I have taken full responsibility for the problem.', tense: 'Present Perfect' },
          { text: 'They will take the exam next Monday.', tense: 'Future' },
        ],
      },
      {
        word: 'depend',
        type: 'verb',
        level: 'B1',
        primary_meaning: 'depender',
        difficulty: 3,
        is_irregular: false,
        meanings: ['depender de', 'contar com', 'confiar em'],
        contexts: [
          { name: 'depend on a person', description: 'depender de alguém', example: 'depend on someone' },
          { name: 'depend on a situation', description: 'depender de uma situação', example: 'it depends on...' },
          { name: 'depend on + gerund', description: 'depender de uma ação', example: 'depend on doing' },
        ],
        sentences: [
          { text: 'The result depends on how much effort you put in.', tense: 'Present Simple' },
          { text: 'It all depended on the weather that day.', tense: 'Past Simple' },
          { text: 'She has always depended on her intuition.', tense: 'Present Perfect' },
          { text: 'Everything will depend on the board\'s decision.', tense: 'Future' },
        ],
      },
      {
        word: 'deal',
        type: 'verb',
        level: 'B1',
        primary_meaning: 'lidar / negociar',
        difficulty: 3,
        is_irregular: true,
        forms: { past_simple: 'dealt', past_participle: 'dealt', present_participle: 'dealing', third_person: 'deals' },
        meanings: ['lidar com', 'negociar', 'tratar', 'distribuir'],
        contexts: [
          { name: 'deal with a problem', description: 'lidar com um problema', example: 'deal with a situation' },
          { name: 'deal with a person', description: 'lidar com uma pessoa', example: 'deal with someone' },
          { name: 'business deal', description: 'negociar um negócio', example: 'deal with a client' },
        ],
        sentences: [
          { text: 'I try to deal with problems calmly.', tense: 'Present Simple' },
          { text: 'She dealt with the complaint professionally.', tense: 'Past Simple' },
          { text: 'He has been dealing with this situation for months.', tense: 'Present Perfect Continuous' },
          { text: 'We will need to deal with these issues before the deadline.', tense: 'Future' },
        ],
      },
    ];

    for (const verb of verbs) {
      // Inserir vocabulário
      const vocabRes = await pool.query(`
        INSERT INTO vocabulary_items (word, type, level, primary_meaning, difficulty, is_irregular)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (word, type) DO UPDATE SET
          primary_meaning = EXCLUDED.primary_meaning,
          difficulty = EXCLUDED.difficulty
        RETURNING id
      `, [verb.word, verb.type, verb.level, verb.primary_meaning, verb.difficulty, verb.is_irregular || false]);

      const vocabId = vocabRes.rows[0].id;

      // Inserir formas verbais se irregular
      if (verb.forms) {
        await pool.query(`
          INSERT INTO verb_forms (vocabulary_item_id, base_form, past_simple, past_participle, present_participle, third_person_singular)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [vocabId, verb.word, verb.forms.past_simple, verb.forms.past_participle, verb.forms.present_participle, verb.forms.third_person]);
      }

      // Inserir significados
      for (let i = 0; i < verb.meanings.length; i++) {
        await pool.query(`
          INSERT INTO meanings (vocabulary_item_id, meaning_text, language, sort_order)
          VALUES ($1, $2, 'pt', $3)
          ON CONFLICT DO NOTHING
        `, [vocabId, verb.meanings[i], i]);
      }

      // Inserir contextos
      for (const ctx of verb.contexts) {
        await pool.query(`
          INSERT INTO contexts (vocabulary_item_id, context_name, description, example_structure)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
        `, [vocabId, ctx.name, ctx.description, ctx.example]);
      }

      // Inserir frases
      for (const sent of verb.sentences) {
        await pool.query(`
          INSERT INTO sentences (vocabulary_item_id, student_id, sentence_text, tense, source)
          VALUES ($1, $2, $3, $4, 'teacher')
          ON CONFLICT DO NOTHING
        `, [vocabId, studentId, sent.text, sent.tense]);
      }

      // Inserir progresso do estudante
      const hoursOffset = Math.floor(Math.random() * 24);
      await pool.query(`
        INSERT INTO student_vocabulary (student_id, vocabulary_item_id, mastery_level, status, review_priority, next_review_at)
        VALUES ($1, $2, $3, $4, $5, NOW() + make_interval(hours => $6))
        ON CONFLICT (student_id, vocabulary_item_id) DO NOTHING
      `, [
        studentId, vocabId,
        verb.word === 'avoid' || verb.word === 'depend' ? 2 : 3,
        verb.word === 'avoid' || verb.word === 'depend' ? 'yellow' : 'green',
        verb.word === 'depend' ? 75 : verb.word === 'avoid' ? 60 : 30,
        hoursOffset,
      ]);

      // Inserir prática de tempos verbais
      const tenses = ['Present Simple', 'Past Simple', 'Present Perfect', 'Present Continuous', 'Future'];
      for (const tense of tenses) {
        const correct = Math.floor(Math.random() * 8) + 1;
        const incorrect = Math.floor(Math.random() * 4);
        const daysAgo = Math.floor(Math.random() * 14);
        await pool.query(`
          INSERT INTO tense_practice (student_id, vocabulary_item_id, tense, total_reviews, total_correct, total_incorrect, mastery_level, status, last_practiced_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - make_interval(days => $9))
          ON CONFLICT (student_id, vocabulary_item_id, tense) DO NOTHING
        `, [
          studentId, vocabId, tense,
          correct + incorrect, correct, incorrect,
          Math.floor(correct / (correct + incorrect + 0.1) * 5),
          correct / (correct + incorrect + 0.1) > 0.75 ? 'green' : correct / (correct + incorrect + 0.1) > 0.4 ? 'yellow' : 'red',
          daysAgo,
        ]);
      }

      console.log(`✅ Verbo inserido: ${verb.word}`);
    }

    // =====================================================
    // PARÁGRAFO DE EXEMPLO
    // =====================================================
    const paraRes = await pool.query(`
      INSERT INTO paragraphs (student_id, paragraph_text, notes, source)
      VALUES ($1, $2, $3, 'teacher')
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      studentId,
      `I usually avoid unnecessary conflicts at work. However, when a problem appears, I try to deal with it calmly. If the situation becomes serious, I discuss it with my manager. It all depends on how critical the issue is.`,
      'Parágrafo usando: avoid, deal with, depend on',
    ]);

    if (paraRes.rows.length > 0) {
      const paraId = paraRes.rows[0].id;
      // Associar vocabulário ao parágrafo
      const vocabWords = await pool.query(`SELECT id FROM vocabulary_items WHERE word IN ('avoid', 'deal', 'depend')`);
      for (const v of vocabWords.rows) {
        await pool.query(`
          INSERT INTO paragraph_vocabulary (paragraph_id, vocabulary_item_id)
          VALUES ($1, $2) ON CONFLICT DO NOTHING
        `, [paraId, v.id]);
      }
      console.log('✅ Parágrafo de exemplo criado.');
    }

    // =====================================================
    // HISTÓRICO DE REVISÕES (dados de exemplo)
    // =====================================================
    const sessionRes = await pool.query(`
      INSERT INTO study_sessions (student_id, session_type, started_at, finished_at, total_items, correct_count, incorrect_count)
      VALUES ($1, 'mixed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '45 minutes', 12, 9, 3)
      RETURNING id
    `, [studentId]);
    
    const sessionId = sessionRes.rows[0].id;
    const vocabItems = await pool.query(`SELECT id, word FROM vocabulary_items LIMIT 3`);
    
    for (const item of vocabItems.rows) {
      const result = Math.random() > 0.3 ? 'correct' : 'partial';
      await pool.query(`
        INSERT INTO reviews (student_id, vocabulary_item_id, session_id, result, difficulty_rating, meaning_correct, grammar_correct, tense_practiced, reviewed_at)
        VALUES ($1, $2, $3, $4, 'medium', true, $5, 'Present Simple', NOW() - INTERVAL '3 days')
      `, [studentId, item.id, sessionId, result, result === 'correct']);

      if (result !== 'correct') {
        await pool.query(`
          INSERT INTO errors (student_id, vocabulary_item_id, error_category, explanation, tense)
          VALUES ($1, $2, 'grammar', 'Erro de conjugação na revisão de exemplo', 'Present Simple')
        `, [studentId, item.id]);
      }
    }

    console.log('✅ Histórico de revisões criado.');

    await pool.end();
    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('📊 Dados criados:');
    console.log('   - 1 estudante (Filipe - B1)');
    console.log('   - 6 verbos (avoid, run, make, take, depend, deal)');
    console.log('   - Significados, contextos e frases para cada verbo');
    console.log('   - Progresso inicial do estudante');
    console.log('   - Histórico de revisões de exemplo');
    console.log('   - 1 parágrafo de exemplo');

  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seed();
