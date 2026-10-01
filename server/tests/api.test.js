/**
 * TESTES DE INTEGRAÇÃO — API REST
 *
 * Usa supertest contra o Express app real (sem listen).
 * Cria pool próprio para evitar problemas de timing com dotenv + Jest.
 */
const { Pool } = require('pg');
const request = require('supertest');
const express = require('express');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });

// Pool próprio do teste — credenciais lidas do .env (DB_PASSWORD)
const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'reviewdatabase',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// Mock do módulo de conexão — usa o pool com credenciais do .env
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

const cors2 = require('cors');

function buildApp() {
  const app = express();
  app.use(cors2());
  app.use(express.json());
  app.use('/api/students', require('../src/routes/students'));
  app.use('/api/vocabulary', require('../src/routes/vocabulary'));
  app.use('/api/reviews', require('../src/routes/reviews'));
  app.use('/api/sessions', require('../src/routes/sessions'));
  app.use('/api/sentences', require('../src/routes/sentences'));
  app.use('/api/dashboard', require('../src/routes/dashboard'));
  app.get('/api/health', async (req, res) => {
    try {
      await testPool.query('SELECT 1');
      res.json({ status: 'ok', db: 'connected' });
    } catch (e) {
      res.status(500).json({ status: 'error', db: e.message });
    }
  });
  return app;
}

let app;
let testStudentId;
let testVocabId;
let testSessionId;

beforeAll(async () => {
  app = buildApp();
  const res = await testPool.query(
    "INSERT INTO students (name, current_level) VALUES ('__Test Student__', 'B1') RETURNING *"
  );
  testStudentId = res.rows[0].id;
});

afterAll(async () => {
  // Ordem importa: FKs compostas exigem deletar dependentes antes
  await testPool.query('DELETE FROM pronunciation_practice WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM tense_practice WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM errors WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM reviews WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM study_sessions WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM sentences WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM contexts WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM meanings WHERE vocabulary_item_id IN (SELECT id FROM vocabulary_items WHERE student_id = $1)', [testStudentId]);
  await testPool.query('DELETE FROM student_vocabulary WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM vocabulary_items WHERE student_id = $1', [testStudentId]);
  await testPool.query('DELETE FROM students WHERE id = $1', [testStudentId]);
  await testPool.end();
});

// ─── Health ───────────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('retorna status ok e db connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
  });
});

// ─── Students ─────────────────────────────────────────────────────────────────
describe('Students API', () => {
  it('GET /api/students — retorna array', async () => {
    const res = await request(app).get('/api/students');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/students — inclui estudante de teste', async () => {
    const res = await request(app).get('/api/students');
    const found = res.body.find(s => s.id === testStudentId);
    expect(found).toBeDefined();
    expect(found.name).toBe('__Test Student__');
  });

  it('GET /api/students/:id — retorna estudante específico', async () => {
    const res = await request(app).get(`/api/students/${testStudentId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testStudentId);
  });

  it('GET /api/students/:id — 404 para ID inexistente', async () => {
    const res = await request(app).get('/api/students/999999');
    expect(res.status).toBe(404);
  });

  it('POST /api/students — cria e retorna estudante sem vincular vocabulário prévio (T-026)', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({ name: '__Temp Student__', current_level: 'A2' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('__Temp Student__');

    // T-026: Deve começar com zero itens vinculados
    const svCheck = await testPool.query('SELECT COUNT(*) FROM student_vocabulary WHERE student_id = $1', [res.body.id]);
    expect(parseInt(svCheck.rows[0].count, 10)).toBe(0);

    const tpCheck = await testPool.query('SELECT COUNT(*) FROM tense_practice WHERE student_id = $1', [res.body.id]);
    expect(parseInt(tpCheck.rows[0].count, 10)).toBe(0);

    await testPool.query('DELETE FROM students WHERE id = $1', [res.body.id]);
  });

  it('POST /api/students — erro 400 sem name', async () => {
    const res = await request(app).post('/api/students').send({});
    expect(res.status).toBe(400);
  });

  it('PATCH /api/students/:id — atualiza level', async () => {
    const res = await request(app)
      .patch(`/api/students/${testStudentId}`)
      .send({ current_level: 'C1' });
    expect(res.status).toBe(200);
    expect(res.body.current_level).toBe('C1');
    await request(app).patch(`/api/students/${testStudentId}`).send({ current_level: 'B1' });
  });
});

// ─── Vocabulary ───────────────────────────────────────────────────────────────
describe('Vocabulary API', () => {
  it('GET /api/vocabulary — retorna array', async () => {
    const res = await request(app)
      .get('/api/vocabulary')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/vocabulary — cria item com studentId', async () => {
    const res = await request(app)
      .post('/api/vocabulary')
      .set('X-Student-Id', String(testStudentId))
      .send({
        word: '__testverb__',
        type: 'verb',
        level: 'B1',
        primary_meaning: 'verbo de teste',
        difficulty: 3,
        meanings: ['testar'],
        contexts: [{ name: 'test ctx', description: 'desc', example: 'I __testverb__ things' }],
      });
    expect(res.status).toBe(201);
    expect(res.body.word).toBe('__testverb__');
    testVocabId = res.body.id;
  });

  it('POST /api/vocabulary — retorna 400 sem word', async () => {
    const res = await request(app)
      .post('/api/vocabulary')
      .set('X-Student-Id', String(testStudentId))
      .send({ type: 'verb' });
    expect(res.status).toBe(400);
  });

  it('GET /api/vocabulary/:id — retorna item com meanings e contexts', async () => {
    if (!testVocabId) return;
    const res = await request(app)
      .get(`/api/vocabulary/${testVocabId}`)
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(res.body.word).toBe('__testverb__');
    expect(Array.isArray(res.body.meanings)).toBe(true);
    expect(Array.isArray(res.body.contexts)).toBe(true);
  });

  it('GET /api/vocabulary?type=verb — filtra por tipo', async () => {
    const res = await request(app)
      .get('/api/vocabulary?type=verb')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    res.body.forEach(item => expect(item.type).toBe('verb'));
  });

  it('GET /api/vocabulary?q=__testverb__ — busca por palavra', async () => {
    const res = await request(app)
      .get('/api/vocabulary?q=__testverb__')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(res.body.some(i => i.word === '__testverb__')).toBe(true);
  });

  it('GET /api/vocabulary/:id — 404 para ID inexistente', async () => {
    const res = await request(app)
      .get('/api/vocabulary/999999')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(404);
  });
});

// ─── Sessions ─────────────────────────────────────────────────────────────────
describe('Sessions API', () => {
  it('POST /api/sessions — cria sessão', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('X-Student-Id', String(testStudentId))
      .send({ sessionType: 'mixed' });
    expect(res.status).toBe(201);
    expect(res.body.student_id).toBe(testStudentId);
    testSessionId = res.body.id;
  });

  it('GET /api/sessions — retorna sessões do estudante', async () => {
    const res = await request(app)
      .get('/api/sessions')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PATCH /api/sessions/:id — finaliza sessão', async () => {
    if (!testSessionId) return;
    const res = await request(app)
      .patch(`/api/sessions/${testSessionId}`)
      .set('X-Student-Id', String(testStudentId))
      .send({ notes: 'Teste finalizado' });
    expect(res.status).toBe(200);
    expect(res.body.finished_at).not.toBeNull();
  });
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
describe('Reviews API', () => {
  it('GET /api/reviews/queue — retorna fila de revisão', async () => {
    const res = await request(app)
      .get('/api/reviews/queue')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('GET /api/reviews/queue — 400 sem X-Student-Id', async () => {
    const res = await request(app).get('/api/reviews/queue');
    expect(res.status).toBe(400);
  });

  it('POST /api/reviews — registra revisão "correct"', async () => {
    if (!testVocabId) return;
    const res = await request(app)
      .post('/api/reviews')
      .set('X-Student-Id', String(testStudentId))
      .send({
        vocabularyItemId: testVocabId,
        result: 'correct',
        tensePracticed: 'Present Simple',
        errorCategories: [],
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('review');
    expect(res.body).toHaveProperty('updatedItem');
    expect(res.body.updatedItem.status).toBeDefined();
  });

  it('POST /api/reviews — registra revisão "incorrect" com erros', async () => {
    if (!testVocabId) return;
    const res = await request(app)
      .post('/api/reviews')
      .set('X-Student-Id', String(testStudentId))
      .send({
        vocabularyItemId: testVocabId,
        result: 'incorrect',
        errorCategories: ['grammar', 'tense'],
        teacherNotes: 'Confused tenses',
      });
    expect(res.status).toBe(201);
    // Após um correct e um incorrect, pode ser 'red' ou 'yellow' dependendo do SRS
    expect(['red', 'yellow']).toContain(res.body.updatedItem.status);
  });

  it('POST /api/reviews — 400 sem campos obrigatórios', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('X-Student-Id', String(testStudentId))
      .send({});
    expect(res.status).toBe(400);
  });

  it('GET /api/reviews/history — retorna histórico', async () => {
    const res = await request(app)
      .get('/api/reviews/history')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/reviews/errors — retorna erros por categoria', async () => {
    const res = await request(app)
      .get('/api/reviews/errors')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─── Sentences ────────────────────────────────────────────────────────────────
describe('Sentences API', () => {
  it('GET /api/sentences — retorna array', async () => {
    const res = await request(app)
      .get('/api/sentences')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/sentences — cria frase', async () => {
    if (!testVocabId) return;
    const res = await request(app)
      .post('/api/sentences')
      .set('X-Student-Id', String(testStudentId))
      .send({
        vocabularyItemId: testVocabId,
        sentence_text: 'I __testverb__ every day.',
        translation: 'Eu faço isso todo dia.',
        tense: 'Present Simple',
      });
    expect(res.status).toBe(201);
    expect(res.body.sentence_text).toBe('I __testverb__ every day.');
  });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
describe('Dashboard API', () => {
  it('GET /api/dashboard — retorna estrutura completa', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('X-Student-Id', String(testStudentId));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body).toHaveProperty('priorityItems');
    expect(res.body).toHaveProperty('recentSessions');
    expect(res.body).toHaveProperty('errorsByCategory');
    expect(res.body).toHaveProperty('weeklyProgress');
    expect(res.body).toHaveProperty('byLevel');
  });

  it('GET /api/dashboard — stats tem campos esperados', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('X-Student-Id', String(testStudentId));
    const { stats } = res.body;
    expect(stats).toHaveProperty('total_vocab');
    expect(stats).toHaveProperty('mastered');
    expect(stats).toHaveProperty('pending_reviews');
  });

  it('GET /api/dashboard — 400 sem X-Student-Id', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(400);
  });
});
