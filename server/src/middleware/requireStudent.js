const db = require('../db/connection');

/**
 * requireStudent — middleware de identificação do estudante ativo (T-025)
 *
 * Lê X-Student-Id do cabeçalho, valida que o estudante existe no banco,
 * e define req.studentId (integer). Retorna 400 se ausente, 404 se inexistente.
 *
 * Honestidade (conforme modelo-logico-alvo.md §4): isso SEPARA os dados por
 * estudante, mas não os PROTEGE de quem tem acesso ao app. Para uso local/offline.
 */
async function requireStudent(req, res, next) {
  const raw = req.headers['x-student-id'];
  if (!raw) {
    return res.status(400).json({ error: 'Header X-Student-Id é obrigatório' });
  }
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'X-Student-Id deve ser um número inteiro' });
  }
  try {
    const result = await db.query('SELECT id FROM students WHERE id = $1', [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: `Estudante ${id} não encontrado` });
    }
    req.studentId = id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { requireStudent };
