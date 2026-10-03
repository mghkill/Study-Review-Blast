-- =====================================================
-- ENGLISH STUDY PLATFORM — SCHEMA COMPLETO
-- PostgreSQL 18
-- =====================================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- STUDENTS (Estudantes)
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  current_level VARCHAR(5) NOT NULL DEFAULT 'A1' CHECK (current_level IN ('A1','A2','B1','B2','C1')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VOCABULARY_ITEMS (Palavras, verbos, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS vocabulary_items (
  id SERIAL PRIMARY KEY,
  word VARCHAR(200) NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'verb' CHECK (type IN (
    'verb','noun','adjective','adverb','preposition',
    'phrasal_verb','expression','grammar','other'
  )),
  level VARCHAR(5) NOT NULL DEFAULT 'A1' CHECK (level IN ('A1','A2','B1','B2','C1')),
  primary_meaning TEXT,
  notes TEXT,
  difficulty SMALLINT DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  is_irregular BOOLEAN DEFAULT FALSE,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word, type)
);

-- =====================================================
-- VERB_FORMS (Formas verbais irregulares)
-- =====================================================
CREATE TABLE IF NOT EXISTS verb_forms (
  id SERIAL PRIMARY KEY,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  base_form VARCHAR(100),
  past_simple VARCHAR(100),
  past_participle VARCHAR(100),
  third_person_singular VARCHAR(100),
  present_participle VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MEANINGS (Significados de uma palavra)
-- =====================================================
CREATE TABLE IF NOT EXISTS meanings (
  id SERIAL PRIMARY KEY,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  meaning_text TEXT NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'pt',
  sort_order SMALLINT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTEXTS (Contextos de uso)
-- =====================================================
CREATE TABLE IF NOT EXISTS contexts (
  id SERIAL PRIMARY KEY,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  context_name VARCHAR(200) NOT NULL,
  description TEXT,
  example_structure TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SENTENCES (Frases)
-- =====================================================
CREATE TABLE IF NOT EXISTS sentences (
  id SERIAL PRIMARY KEY,
  vocabulary_item_id INTEGER REFERENCES vocabulary_items(id) ON DELETE SET NULL,
  context_id INTEGER REFERENCES contexts(id) ON DELETE SET NULL,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  sentence_text TEXT NOT NULL,
  translation TEXT,
  tense VARCHAR(50),
  notes TEXT,
  source VARCHAR(30) DEFAULT 'teacher' CHECK (source IN ('teacher','student','book','other','generated')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','mastered','archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PARAGRAPHS (Parágrafos)
-- =====================================================
CREATE TABLE IF NOT EXISTS paragraphs (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  paragraph_text TEXT NOT NULL,
  notes TEXT,
  source VARCHAR(30) DEFAULT 'teacher',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de junção: parágrafo ↔ vocabulário
CREATE TABLE IF NOT EXISTS paragraph_vocabulary (
  paragraph_id INTEGER REFERENCES paragraphs(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  PRIMARY KEY (paragraph_id, vocabulary_item_id)
);

-- =====================================================
-- STUDENT_VOCABULARY (Progresso do estudante por item)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_vocabulary (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  -- Escala de domínio: 0=não aprendido, 1=reconheço, 2=lembro c/ ajuda, 3=produzo, 4=contexto, 5=domínio
  mastery_level SMALLINT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  -- Status visual: green/yellow/red
  status VARCHAR(10) DEFAULT 'red' CHECK (status IN ('green','yellow','red')),
  -- Dados de revisão (SRS - Spaced Repetition System)
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  review_interval_days FLOAT DEFAULT 1,
  ease_factor FLOAT DEFAULT 2.5,
  -- Estatísticas
  total_reviews INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_incorrect INTEGER DEFAULT 0,
  consecutive_correct INTEGER DEFAULT 0,
  consecutive_incorrect INTEGER DEFAULT 0,
  recent_errors INTEGER DEFAULT 0, -- erros nos últimos 7 dias
  -- Prioridade calculada (quanto maior = mais urgente revisar)
  review_priority FLOAT DEFAULT 50,
  -- Datas
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, vocabulary_item_id)
);

-- =====================================================
-- TENSE_PRACTICE (Prática por tempo verbal)
-- =====================================================
CREATE TABLE IF NOT EXISTS tense_practice (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  tense VARCHAR(50) NOT NULL,
  total_reviews INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_incorrect INTEGER DEFAULT 0,
  mastery_level SMALLINT DEFAULT 0,
  status VARCHAR(10) DEFAULT 'red',
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, vocabulary_item_id, tense)
);

-- =====================================================
-- CONTEXT_MASTERY (Domínio por contexto)
-- =====================================================
CREATE TABLE IF NOT EXISTS context_mastery (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  context_id INTEGER NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
  mastery_level SMALLINT DEFAULT 0,
  status VARCHAR(10) DEFAULT 'red',
  total_reviews INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, context_id)
);

-- =====================================================
-- STUDY_SESSIONS (Sessões de estudo)
-- =====================================================
CREATE TABLE IF NOT EXISTS study_sessions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_type VARCHAR(30) DEFAULT 'mixed' CHECK (session_type IN (
    'mixed','full','new_acquisition','review','pronunciation','weak_items','specific_verb',
    'custom_quiz','green','maintenance','yellow','consolidation','all','free_practice'
  )),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  total_items INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  quiz_id INTEGER,
  notes TEXT
);

-- =====================================================
-- REVIEWS (Revisões individuais)
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES study_sessions(id) ON DELETE SET NULL,
  sentence_id INTEGER REFERENCES sentences(id) ON DELETE SET NULL,
  -- Resultado geral
  result VARCHAR(20) NOT NULL CHECK (result IN ('correct','partial','incorrect')),
  difficulty_rating VARCHAR(10) CHECK (difficulty_rating IN ('easy','medium','hard')),
  -- Subresultados
  meaning_correct BOOLEAN,
  grammar_correct BOOLEAN,
  sentence_correct BOOLEAN,
  pronunciation_correct BOOLEAN,
  pronunciation_rating VARCHAR(20) CHECK (pronunciation_rating IN ('excellent','good','needs_improvement','very_weak')),
  -- Conteúdo da revisão
  student_answer TEXT,
  teacher_notes TEXT,
  tense_practiced VARCHAR(50),
  context_practiced INTEGER REFERENCES contexts(id),
  -- Categorias de erro
  error_categories TEXT[], -- array de categorias
  -- Algoritmo
  priority_before FLOAT,
  priority_after FLOAT,
  interval_before FLOAT,
  interval_after FLOAT,
  -- Auditoria (por que este item foi escolhido?)
  selection_reason JSONB,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ERRORS (Registro detalhado de erros)
-- =====================================================
CREATE TABLE IF NOT EXISTS errors (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  -- Categoria do erro
  error_category VARCHAR(30) NOT NULL CHECK (error_category IN (
    'meaning','grammar','tense','conjugation','preposition',
    'collocation','sentence_structure','context','pronunciation',
    'spelling','word_choice','other'
  )),
  -- Detalhes
  expected_text TEXT,
  student_text TEXT,
  explanation TEXT,
  tense VARCHAR(50),
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRONUNCIATION_PRACTICE (Prática de pronúncia)
-- =====================================================
CREATE TABLE IF NOT EXISTS pronunciation_practice (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER REFERENCES vocabulary_items(id) ON DELETE SET NULL,
  sentence_id INTEGER REFERENCES sentences(id) ON DELETE SET NULL,
  -- Avaliação do professor
  is_correct BOOLEAN NOT NULL,
  rating VARCHAR(20) CHECK (rating IN ('excellent','good','needs_improvement','very_weak')),
  problem_description TEXT,
  teacher_notes TEXT,
  practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STUDENT_SENTENCES (Frases produzidas pelo aluno)
-- =====================================================
CREATE TABLE IF NOT EXISTS student_sentences (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER REFERENCES vocabulary_items(id) ON DELETE SET NULL,
  sentence_text TEXT NOT NULL,
  context TEXT,
  tense VARCHAR(50),
  -- Avaliação do professor
  teacher_result VARCHAR(20) CHECK (teacher_result IN ('correct','partial','incorrect','not_evaluated')),
  teacher_notes TEXT,
  pronunciation_rating VARCHAR(20),
  grammar_rating VARCHAR(20),
  meaning_rating VARCHAR(20),
  naturalness_rating VARCHAR(20),
  vocabulary_rating VARCHAR(20),
  error_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CUSTOM_QUIZZES (Quizzes personalizados)
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_quizzes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  block_size SMALLINT NOT NULL DEFAULT 5 CHECK (block_size IN (5, 10)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_custom_quizzes_id_student UNIQUE (id, student_id)
);

-- =====================================================
-- CUSTOM_QUIZ_QUESTIONS (Questões do quiz personalizado)
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_quiz_questions (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  quiz_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vocabulary_item_id INTEGER NOT NULL,
  context_id INTEGER,
  prompt_text TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT cqq_quiz_student_fk FOREIGN KEY (quiz_id, student_id)
    REFERENCES custom_quizzes(id, student_id) ON DELETE CASCADE,
  CONSTRAINT cqq_vocab_student_fk FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items(id, student_id) ON DELETE CASCADE,
  CONSTRAINT cqq_context_student_fk FOREIGN KEY (context_id, student_id)
    REFERENCES contexts(id, student_id) ON DELETE SET NULL (context_id),
  CONSTRAINT uq_cqq_quiz_position UNIQUE (quiz_id, position)
);

-- =====================================================
-- ÍNDICES para performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_student_vocab_student ON student_vocabulary(student_id);
CREATE INDEX IF NOT EXISTS idx_student_vocab_next_review ON student_vocabulary(next_review_at);
CREATE INDEX IF NOT EXISTS idx_student_vocab_priority ON student_vocabulary(review_priority DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_student ON reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vocab ON reviews(vocabulary_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(reviewed_at);
CREATE INDEX IF NOT EXISTS idx_errors_student ON errors(student_id);
CREATE INDEX IF NOT EXISTS idx_errors_category ON errors(error_category);
CREATE INDEX IF NOT EXISTS idx_sentences_vocab ON sentences(vocabulary_item_id);
CREATE INDEX IF NOT EXISTS idx_tense_practice_student ON tense_practice(student_id, vocabulary_item_id);

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
