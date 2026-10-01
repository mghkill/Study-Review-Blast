/**
 * Pool de conexão PostgreSQL — lazy initialization
 *
 * O pool é criado na primeira vez que query() ou getClient() é chamado,
 * não no momento do require(). Isso permite que testes carreguem
 * variáveis de ambiente ANTES de a conexão ser estabelecida.
 */
const { Pool } = require('pg');
const path = require('path');

// Carrega .env se ainda não estiver no process.env
if (!process.env.DB_NAME) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

let _pool = null;

function getPool() {
  if (!_pool) {
    _pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'reviewdatabase',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,  // undefined → SASL error; deve vir do .env
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    _pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return _pool;
}

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await getPool().query(text, params);
    if (process.env.NODE_ENV === 'development') {
      // console.log('Query', { text, duration: Date.now() - start, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('Database query error:', { text, error: err.message });
    throw err;
  }
}

async function getClient() {
  return getPool().connect();
}

// Expõe o pool para casos que precisam de acesso direto (e.g. testes)
Object.defineProperty(module.exports, 'pool', {
  get: () => getPool(),
  enumerable: true,
});

module.exports.query = query;
module.exports.getClient = getClient;
