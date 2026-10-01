/**
 * TESTES DE ISOLAMENTO POR ESTUDANTE (TDD - Fase 2)
 *
 * Conforme references/modelo-logico-alvo.md, seção 3:
 * Estes testes garantem que cada estudante veja, altere e revise
 * estritamente seus próprios dados, rejeitando vazamentos entre contas.
 */
const { Pool } = require('pg');
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });

const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'reviewdatabase',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Mock da conexão para apontar para as variáveis do ambiente
jest.mock('../src/db/connection', () => {
  const { Pool } = require('pg');
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
  require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });

  const mockPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'reviewdatabase',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  return {
    get pool() { return mockPool; },
    query: (text, params) => mockPool.query(text, params),
    getClient: () => mockPool.connect(),
  };
});

function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/students', require('../src/routes/students'));
  app.use('/api/vocabulary', require('../src/routes/vocabulary'));
  app.use('/api/reviews', require('../src/routes/reviews'));
  app.use('/api/sessions', require('../src/routes/sessions'));
  app.use('/api/sentences', require('../src/routes/sentences'));
  app.use('/api/dashboard', require('../src/routes/dashboard'));

  return app;
}

let app;
let studentAId;
let studentBId;
let wordAId;
let wordBId;

beforeAll(async () => {
  app = buildApp();

  // Limpeza de testes anteriores caso tenham sobrado
  await testPool.query("DELETE FROM students WHERE name IN ('__Student_Iso_A__', '__Student_Iso_B__', '__Student_Iso_C__')");
  await testPool.query("DELETE FROM vocabulary_items WHERE word IN ('__iso_word_a__', '__iso_word_b__')");

  // Cria Estudante A e Estudante B
  const resA = await testPool.query(
    "INSERT INTO students (name, current_level) VALUES ('__Student_Iso_A__', 'B1') RETURNING id"
  );
  studentAId = resA.rows[0].id;

  const resB = await testPool.query(
    "INSERT INTO students (name, current_level) VALUES ('__Student_Iso_B__', 'B2') RETURNING id"
  );
  studentBId = resB.rows[0].id;

  // Cria palavra A
  const resWordA = await testPool.query(
    "INSERT INTO vocabulary_items (word, type, level, primary_meaning) VALUES ('__iso_word_a__', 'verb', 'B1', 'meaning a') RETURNING id"
  );
  wordAId = resWordA.rows[0].id;

  // Cria palavra B
  const resWordB = await testPool.query(
    "INSERT INTO vocabulary_items (word, type, level, primary_meaning) VALUES ('__iso_word_b__', 'verb', 'B2', 'meaning b') RETURNING id"
  );
  wordBId = resWordB.rows[0].id;

  // Vincula palavras na tabela student_vocabulary
  await testPool.query(
    "INSERT INTO student_vocabulary (student_id, vocabulary_item_id, mastery_level) VALUES ($1, $2, 1) ON CONFLICT DO NOTHING",
    [studentAId, wordAId]
  );
  await testPool.query(
    "INSERT INTO student_vocabulary (student_id, vocabulary_item_id, mastery_level) VALUES ($1, $2, 1) ON CONFLICT DO NOTHING",
    [studentBId, wordBId]
  );
});

afterAll(async () => {
  await testPool.query("DELETE FROM students WHERE name IN ('__Student_Iso_A__', '__Student_Iso_B__', '__Student_Iso_C__')");
  await testPool.query("DELETE FROM vocabulary_items WHERE word IN ('__iso_word_a__', '__iso_word_b__')");
  await testPool.end();
});

describe('Isolamento de Estudantes — Header X-Student-Id', () => {
  it('Requisição sem X-Student-Id responde 400 com erro descritivo', async () => {
    const res = await request(app).get('/api/vocabulary');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('Requisição com X-Student-Id inexistente responde 404', async () => {
    const res = await request(app)
      .get('/api/vocabulary')
      .set('X-Student-Id', '999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Isolamento de Vocabulário', () => {
  it('GET /api/vocabulary de B não contém a palavra de A', async () => {
    const res = await request(app)
      .get('/api/vocabulary')
      .set('X-Student-Id', String(studentBId));

    expect(res.status).toBe(200);
    const words = res.body.map(item => item.word);
    expect(words).toContain('__iso_word_b__');
    expect(words).not.toContain('__iso_word_a__');
  });

  it('GET /api/vocabulary/:id de B sobre palavra de A responde 404', async () => {
    const res = await request(app)
      .get(`/api/vocabulary/${wordAId}`)
      .set('X-Student-Id', String(studentBId));

    expect(res.status).toBe(404);
  });

  it('PATCH /api/vocabulary/:id de B sobre palavra de A responde 404', async () => {
    const res = await request(app)
      .patch(`/api/vocabulary/${wordAId}`)
      .set('X-Student-Id', String(studentBId))
      .send({ notes: 'Tentativa de alteração por B' });

    expect(res.status).toBe(404);
  });

  it('DELETE /api/vocabulary/:id de B sobre palavra de A responde 404', async () => {
    // Palavra dedicada de A para teste de delete
    const resDelWord = await testPool.query(
      "INSERT INTO vocabulary_items (word, type, level, primary_meaning) VALUES ('__iso_word_del_a__', 'verb', 'B1', 'del') RETURNING id"
    );
    const delWordId = resDelWord.rows[0].id;

    const res = await request(app)
      .delete(`/api/vocabulary/${delWordId}`)
      .set('X-Student-Id', String(studentBId));

    // Limpeza
    await testPool.query('DELETE FROM vocabulary_items WHERE id = $1', [delWordId]);

    expect(res.status).toBe(404);
  });
});

describe('Isolamento de Reviews e Sessões', () => {
  it('GET /api/reviews/queue de B só traz palavras pertencentes a B', async () => {
    const res = await request(app)
      .get('/api/reviews/queue')
      .set('X-Student-Id', String(studentBId));

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const itemIds = res.body.map(item => item.id || item.vocabulary_item_id);
    expect(itemIds).not.toContain(wordAId);
  });

  it('POST /api/reviews de B com vocabulary_item_id de A é rejeitado (400 ou 404)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('X-Student-Id', String(studentBId))
      .send({
        vocabulary_item_id: wordAId,
        quality: 4,
      });

    expect([400, 403, 404]).toContain(res.status);
  });
});

describe('Isolamento de Dashboard', () => {
  it('GET /api/dashboard de B conta apenas dados de B', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('X-Student-Id', String(studentBId));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('stats');
    // B tem apenas 1 palavra vinculada
    expect(res.body.stats.total_vocab).toBe(1);
  });
});

describe('Isolamento de Sentences', () => {
  it('GET /api/sentences de B não lista frases de A', async () => {
    // Insere frase para palavra A vinculada a A
    await testPool.query(
      "INSERT INTO sentences (vocabulary_item_id, sentence_text, translation, tense, student_id) VALUES ($1, 'Sentence A only', 'Frase de A', 'Present Simple', $2)",
      [wordAId, studentAId]
    );

    const res = await request(app)
      .get('/api/sentences')
      .set('X-Student-Id', String(studentBId));

    expect(res.status).toBe(200);
    const texts = res.body.map(s => s.sentence_text);
    expect(texts).not.toContain('Sentence A only');
  });

  it('POST /api/sentences de B ignorando student_id de A no corpo', async () => {
    const res = await request(app)
      .post('/api/sentences')
      .set('X-Student-Id', String(studentBId))
      .send({
        vocabularyItemId: wordBId,
        studentId: studentAId, // Tentando injetar ID do A
        sentence_text: 'Sentence by B with studentId A spoofed',
        translation: 'Traducao B',
        tense: 'Present Simple',
      });

    if (res.status === 201) {
      // Se criou, student_id gravado no banco DEVE ser B, nunca A
      const check = await testPool.query(
        "SELECT student_id FROM sentences WHERE sentence_text = 'Sentence by B with studentId A spoofed'"
      );
      expect(check.rows[0].student_id).toBe(studentBId);
    } else {
      expect([400, 403, 404]).toContain(res.status);
    }
  });
});

describe('Isolamento no Ciclo de Vida do Estudante', () => {
  it('Criar estudante C novo: começa com zero palavras no vocabulário', async () => {
    const createRes = await request(app)
      .post('/api/students')
      .send({ name: '__Student_Iso_C__', current_level: 'A1' });

    expect(createRes.status).toBe(201);
    const newStudentId = createRes.body.id;

    const vocabRes = await request(app)
      .get('/api/vocabulary')
      .set('X-Student-Id', String(newStudentId));

    expect(vocabRes.status).toBe(200);
    expect(vocabRes.body.length).toBe(0);
  });

  it('Excluir A remove apenas os dados de A e mantém dados de B', async () => {
    const deleteRes = await request(app)
      .delete(`/api/students/${studentAId}`)
      .set('X-Student-Id', String(studentAId));

    expect([200, 204]).toContain(deleteRes.status);

    // Estudante B continua existindo e acessando seu vocabulário
    const resB = await request(app)
      .get('/api/vocabulary')
      .set('X-Student-Id', String(studentBId));

    expect(resB.status).toBe(200);
  });
});
