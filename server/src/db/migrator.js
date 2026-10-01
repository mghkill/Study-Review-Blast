const fs = require('fs');
const path = require('path');
const { getClient, pool } = require('./connection');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

async function getAppliedVersions(client) {
  await ensureMigrationsTable(client);
  const res = await client.query('SELECT version FROM schema_migrations ORDER BY version ASC');
  return new Set(res.rows.map(r => r.version));
}

function parseMigrationFile(filename) {
  const match = filename.match(/^(\d+)_(.+)\.sql$/);
  if (!match) return null;
  return {
    version: match[1],
    description: match[2],
    filename,
  };
}

async function runMigrations({ migrationsDir = MIGRATIONS_DIR, silent = false } = {}) {
  const client = await getClient();
  const appliedMigrations = [];

  try {
    const appliedVersions = await getAppliedVersions(client);

    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const pending = [];
    for (const file of files) {
      const parsed = parseMigrationFile(file);
      if (!parsed) {
        if (!silent) console.warn(`⚠️ Arquivo ignorado (não segue padrão NNN_nome.sql): ${file}`);
        continue;
      }
      if (!appliedVersions.has(parsed.version)) {
        pending.push(parsed);
      }
    }

    if (pending.length === 0) {
      if (!silent) console.log('✅ Nenhuma migração pendente.');
      return { applied: [] };
    }

    if (!silent) console.log(`📋 Encontradas ${pending.length} migrações pendentes.`);

    for (const migration of pending) {
      const filePath = path.join(migrationsDir, migration.filename);
      const sql = fs.readFileSync(filePath, 'utf8');

      if (!silent) console.log(`⏳ Aplicando migração ${migration.filename}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, name, applied_at) VALUES ($1, $2, NOW())',
          [migration.version, migration.filename]
        );
        await client.query('COMMIT');
        appliedMigrations.push(migration);
        if (!silent) console.log(`✅ Migração ${migration.filename} aplicada com sucesso!`);
      } catch (err) {
        await client.query('ROLLBACK');
        if (!silent) {
          console.error(`❌ Falha ao aplicar migração ${migration.filename}:`, err.message);
        }
        throw new Error(`Migração ${migration.filename} falhou: ${err.message}`);
      }
    }

    return { applied: appliedMigrations };
  } finally {
    client.release();
  }
}

module.exports = {
  runMigrations,
  ensureMigrationsTable,
  getAppliedVersions,
  parseMigrationFile,
};
