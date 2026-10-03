-- Migration 009: language_code em vocabulary_items (T-043)
--
-- Adiciona a coluna language_code VARCHAR(10) NOT NULL DEFAULT 'en' em vocabulary_items,
-- permitindo suporte futuro a outros idiomas no mesmo modelo.

ALTER TABLE vocabulary_items
  ADD COLUMN IF NOT EXISTS language_code VARCHAR(10) NOT NULL DEFAULT 'en';

-- Garantir backfill caso a coluna tenha sido criada sem default
UPDATE vocabulary_items
SET language_code = 'en'
WHERE language_code IS NULL;

-- Índice para consultas filtradas por estudante e idioma
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_lang
  ON vocabulary_items (student_id, language_code);
