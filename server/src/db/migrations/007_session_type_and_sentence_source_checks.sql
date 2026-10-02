-- Migration 007: Ajustar CHECK constraints de study_sessions.session_type e sentences.source (T-041)
--
-- 1. sentences.source: aceitar 'generated' (necessário para o gerador de frases da Fase 4)
-- 2. study_sessions.session_type: cobrir todos os modos da tela "Estudar Agora" e sinônimos canônicos
--    (mixed, full, new_acquisition, review, pronunciation, weak_items, specific_verb,
--     custom_quiz, green, maintenance, yellow, consolidation, all, free_practice)

-- sentences.source
ALTER TABLE sentences
  DROP CONSTRAINT IF EXISTS sentences_source_check;

ALTER TABLE sentences
  ADD CONSTRAINT sentences_source_check
  CHECK (source IN ('teacher', 'student', 'book', 'other', 'generated'));

-- study_sessions.session_type
ALTER TABLE study_sessions
  DROP CONSTRAINT IF EXISTS study_sessions_session_type_check;

ALTER TABLE study_sessions
  ADD CONSTRAINT study_sessions_session_type_check
  CHECK (session_type IN (
    'mixed', 'full',
    'new_acquisition',
    'review',
    'pronunciation',
    'weak_items',
    'specific_verb',
    'custom_quiz',
    'green', 'maintenance',
    'yellow', 'consolidation',
    'all', 'free_practice'
  ));
