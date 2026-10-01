const path = require('path');
// Load env from root .env
const dotenvPath = path.resolve(__dirname, '.env');
const { config } = require(path.resolve(__dirname, 'server', 'node_modules', 'dotenv'));
config({ path: dotenvPath });

const db = require('./server/src/db/connection');

async function migrate() {
  try {
    await db.query(`ALTER TABLE study_sessions DROP CONSTRAINT IF EXISTS study_sessions_session_type_check`);
    await db.query(`
      ALTER TABLE study_sessions 
      ADD CONSTRAINT study_sessions_session_type_check 
      CHECK (session_type IN (
        'mixed','new_acquisition','review','pronunciation',
        'weak_items','specific_verb','custom_quiz','green','yellow','all'
      ))
    `);
    console.log('Migration OK: session_type constraint updated');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
