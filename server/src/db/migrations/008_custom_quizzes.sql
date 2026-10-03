-- Migration 008: Tabelas custom_quizzes e custom_quiz_questions, e coluna study_sessions.quiz_id (T-042)
--
-- 1. custom_quizzes: Quizzes personalizados por estudante com blocos de 5 ou 10 perguntas
-- 2. custom_quiz_questions: Questões associadas ao quiz, com FK compostas (student_id) para
--    custom_quizzes, vocabulary_items e contexts
-- 3. study_sessions.quiz_id: vínculo opcional da sessão com o quiz personalizado executado

-- 1. custom_quizzes
CREATE TABLE IF NOT EXISTS custom_quizzes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  block_size SMALLINT NOT NULL DEFAULT 5 CHECK (block_size IN (5, 10)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_custom_quizzes_id_student UNIQUE (id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_custom_quizzes_student ON custom_quizzes(student_id);

-- 2. custom_quiz_questions
CREATE TABLE IF NOT EXISTS custom_quiz_questions (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER NOT NULL,
  context_id INTEGER,
  prompt_text TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cqq_quiz_student_fk FOREIGN KEY (quiz_id, student_id)
    REFERENCES custom_quizzes(id, student_id) ON DELETE CASCADE,
  CONSTRAINT cqq_vocab_student_fk FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items(id, student_id) ON DELETE CASCADE,
  CONSTRAINT cqq_context_student_fk FOREIGN KEY (context_id, student_id)
    REFERENCES contexts(id, student_id) ON DELETE SET NULL (context_id),
  CONSTRAINT uq_cqq_quiz_position UNIQUE (quiz_id, position)
);

CREATE INDEX IF NOT EXISTS idx_cqq_quiz_id ON custom_quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_cqq_vocab_student ON custom_quiz_questions(vocabulary_item_id, student_id);

-- 3. study_sessions.quiz_id
ALTER TABLE study_sessions
  ADD COLUMN IF NOT EXISTS quiz_id INTEGER;

ALTER TABLE study_sessions
  DROP CONSTRAINT IF EXISTS ss_quiz_student_fk;

ALTER TABLE study_sessions
  ADD CONSTRAINT ss_quiz_student_fk
    FOREIGN KEY (quiz_id, student_id)
    REFERENCES custom_quizzes(id, student_id)
    ON DELETE SET NULL (quiz_id);

CREATE INDEX IF NOT EXISTS idx_study_sessions_quiz_id ON study_sessions(quiz_id) WHERE quiz_id IS NOT NULL;
