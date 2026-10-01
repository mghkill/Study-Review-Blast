require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'reviewdatabase',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function migrate() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');

  console.log('🔄 Conectando ao banco de dados...');
  
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexão com PostgreSQL estabelecida!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    console.error('Verifique as variáveis no arquivo .env');
    process.exit(1);
  }

  if (reset) {
    console.log('⚠️  RESET: Removendo tabelas existentes...');
    await pool.query(`
      DROP TABLE IF EXISTS 
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
  
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  try {
    await pool.query(schema);
    console.log('✅ Schema criado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao criar schema:', err.message);
    process.exit(1);
  }

  await pool.end();
  console.log('🎉 Migration concluída!');
}

migrate();
