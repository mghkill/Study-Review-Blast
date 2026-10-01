const db = require('./src/db/connection');

async function clean() {
  const idsRes = await db.query("SELECT id FROM students WHERE name = '__Test Student__'");
  const ids = idsRes.rows.map(r => r.id);
  if (ids.length === 0) {
    console.log('No students to clean');
    return process.exit(0);
  }
  
  for (const id of ids) {
    await db.query(`DELETE FROM pronunciation_practice WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM tense_practice WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM errors WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM reviews WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM study_sessions WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM sentences WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM contexts WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM meanings WHERE vocabulary_item_id IN (SELECT id FROM vocabulary_items WHERE student_id = $1)`, [id]);
    await db.query(`DELETE FROM student_vocabulary WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM vocabulary_items WHERE student_id = $1`, [id]);
    await db.query(`DELETE FROM students WHERE id = $1`, [id]);
    console.log('Cleaned up student:', id);
  }
  process.exit(0);
}

clean();
