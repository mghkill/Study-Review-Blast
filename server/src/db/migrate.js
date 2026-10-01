const { pool, query } = require('./connection');
const { runMigrations } = require('./migrator');

async function migrate() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');

  console.log('🔄 Conectando ao banco de dados...');

  try {
    await query('SELECT 1');
    console.log('✅ Conexão com PostgreSQL estabelecida!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    console.error('Verifique as variáveis no arquivo .env');
    process.exit(1);
  }

  if (reset) {
    console.log('⚠️  RESET: Removendo tabelas existentes...');
    await query(`
      DROP TABLE IF EXISTS 
        schema_migrations,
        student_sentences, pronunciation_practice, errors,
        reviews, study_sessions, context_mastery, tense_practice,
        student_vocabulary, paragraph_vocabulary, paragraphs,
        sentences, contexts, meanings, verb_forms, vocabulary_items,
        students
      CASCADE;
    `);
    console.log('✅ Tabelas removidas.');
  }

  console.log('📋 Executando migrations...');

  try {
    const result = await runMigrations();
    if (result.applied.length > 0) {
      console.log(`🎉 ${result.applied.length} migração(ões) aplicada(s) com sucesso!`);
    } else {
      console.log('🎉 Banco de dados já está atualizado!');
    }
  } catch (err) {
    console.error('❌ Erro ao executar migrations:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;
