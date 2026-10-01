const fs = require('fs');
const path = require('path');
const os = require('os');
const { parseMigrationFile, runMigrations } = require('../src/db/migrator');
const { query, pool } = require('../src/db/connection');

describe('Database Migrator (T-011)', () => {
  afterAll(async () => {
    await pool.end();
  });
  test('parseMigrationFile extrai versão, descrição e filename corretamente', () => {
    expect(parseMigrationFile('001_baseline.sql')).toEqual({
      version: '001',
      description: 'baseline',
      filename: '001_baseline.sql',
    });

    expect(parseMigrationFile('042_custom_quizzes.sql')).toEqual({
      version: '042',
      description: 'custom_quizzes',
      filename: '042_custom_quizzes.sql',
    });

    expect(parseMigrationFile('invalid_name.sql')).toBeNull();
    expect(parseMigrationFile('README.md')).toBeNull();
  });

  test('aplica migrações em ordem e pula as já aplicadas', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-migrations-test-'));
    try {
      // Cria migração de teste 998 e 999
      fs.writeFileSync(
        path.join(tmpDir, '998_test_migration_a.sql'),
        'CREATE TABLE IF NOT EXISTS _test_mig_a (id SERIAL PRIMARY KEY, val TEXT);'
      );
      fs.writeFileSync(
        path.join(tmpDir, '999_test_migration_b.sql'),
        'CREATE TABLE IF NOT EXISTS _test_mig_b (id SERIAL PRIMARY KEY, val TEXT);'
      );

      // Limpa histórico caso exista de teste anterior
      await query("DELETE FROM schema_migrations WHERE version IN ('998', '999')");

      // Primeira execução: deve aplicar 998 e 999
      const result1 = await runMigrations({ migrationsDir: tmpDir, silent: true });
      expect(result1.applied.map(m => m.version)).toEqual(['998', '999']);

      // Verifica se as tabelas foram criadas e registradas
      const checkA = await query("SELECT to_regclass('_test_mig_a') AS exists");
      expect(checkA.rows[0].exists).not.toBeNull();

      const recordCheck = await query("SELECT version FROM schema_migrations WHERE version IN ('998', '999') ORDER BY version ASC");
      expect(recordCheck.rows.map(r => r.version)).toEqual(['998', '999']);

      // Segunda execução: deve pular todas
      const result2 = await runMigrations({ migrationsDir: tmpDir, silent: true });
      expect(result2.applied).toEqual([]);
    } finally {
      // Limpeza
      await query("DROP TABLE IF EXISTS _test_mig_a, _test_mig_b CASCADE;");
      await query("DELETE FROM schema_migrations WHERE version IN ('998', '999');");
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('faz rollback se uma migração falhar no meio', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-migrations-fail-'));
    try {
      // Migração com SQL inválido
      fs.writeFileSync(
        path.join(tmpDir, '997_test_fail.sql'),
        'CREATE TABLE _test_mig_fail (id INT); SINTAXE_INVALIDA_AQUI;'
      );

      await query("DELETE FROM schema_migrations WHERE version = '997'");

      await expect(
        runMigrations({ migrationsDir: tmpDir, silent: true })
      ).rejects.toThrow();

      // Confirma que tabela não existe (rollback da transação)
      const checkTable = await query("SELECT to_regclass('_test_mig_fail') AS exists");
      expect(checkTable.rows[0].exists).toBeNull();

      // Confirma que não gravou no schema_migrations
      const checkRecord = await query("SELECT 1 FROM schema_migrations WHERE version = '997'");
      expect(checkRecord.rows.length).toBe(0);
    } finally {
      await query("DROP TABLE IF EXISTS _test_mig_fail CASCADE;");
      await query("DELETE FROM schema_migrations WHERE version = '997';");
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
