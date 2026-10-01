-- Migration 002: Posse de vocabulary_items por estudante (T-022)
--
-- Sequência segura (conforme modelo-logico-alvo.md, seção 2):
-- 1. Adicionar student_id nullable (sem quebrar dados existentes)
-- 2. Remover UNIQUE (word, type) antiga
-- 3. Adicionar UNIQUE (student_id, word, type) e UNIQUE (id, student_id)
--    como parciais/diferidas até NOT NULL ser possível em T-023
--
-- ATENÇÃO: student_id ficará NULL nos itens existentes até T-023 preencher
-- os donos. Não rodar T-023 sem ter concluído T-022 primeiro.
-- O NOT NULL será adicionado em T-023 após o preenchimento.

-- 1. Adicionar coluna student_id (nullable por enquanto)
ALTER TABLE vocabulary_items
  ADD COLUMN IF NOT EXISTS student_id INTEGER
    REFERENCES students(id) ON DELETE CASCADE;

-- 2. Remover restrição UNIQUE anterior (word, type)
--    Nome pode variar; tentamos o nome padrão gerado pelo PostgreSQL.
DO $$
BEGIN
  -- Tenta remover pelo nome padrão do baseline
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'vocabulary_items'
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'vocabulary_items_word_type_key'
  ) THEN
    ALTER TABLE vocabulary_items DROP CONSTRAINT vocabulary_items_word_type_key;
  END IF;
END $$;

-- 3. Nova restrição única: (student_id, word, type)
--    Usamos PARTIAL: apenas onde student_id IS NOT NULL
--    (linhas com NULL ficam soltas até T-023 setar o dono)
CREATE UNIQUE INDEX IF NOT EXISTS uq_vocabulary_items_student_word_type
  ON vocabulary_items (student_id, word, type)
  WHERE student_id IS NOT NULL;

-- 4. Constraint UNIQUE (id, student_id) — alvo das futuras chaves compostas
--    Também parcial enquanto há NULLs
CREATE UNIQUE INDEX IF NOT EXISTS uq_vocabulary_items_id_student
  ON vocabulary_items (id, student_id)
  WHERE student_id IS NOT NULL;

-- 5. Índice auxiliar para buscas por dono
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_student_id
  ON vocabulary_items (student_id);
