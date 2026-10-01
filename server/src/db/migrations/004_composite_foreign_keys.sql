-- Migration 004: Chaves estrangeiras compostas (vocabulary_item_id, student_id) (T-024)
--
-- Conforme modelo-logico-alvo.md, seção 2, item 3:
-- Em toda tabela que tem student_id e vocabulary_item_id, substituir a FK simples
-- por FK composta (vocabulary_item_id, student_id) -> vocabulary_items(id, student_id).
-- Isso torna IMPOSSÍVEL gravar progresso de A sobre palavra de B ao nível do banco.
--
-- Tabelas afetadas:
--   - student_vocabulary   (student_id NOT NULL, vocabulary_item_id NOT NULL)
--   - reviews              (student_id NOT NULL, vocabulary_item_id NOT NULL)
--   - errors               (student_id NOT NULL, vocabulary_item_id NOT NULL)
--   - tense_practice       (student_id NOT NULL, vocabulary_item_id NOT NULL)
--   - sentences            (student_id nullable -> NOT NULL depois; vocab nullable -> NOT NULL)
--   - contexts             (sem student_id ainda -> adicionar + FK composta)
--
-- PRÉ-REQUISITO: vocabulary_items.UNIQUE(id, student_id) criado em 002 como índice parcial.
-- Promover para constraint real UNIQUE para ser alvo de FK composta.

-- ══════════════════════════════════════════════════════════════════════
-- 0. Promover o índice parcial UNIQUE(id, student_id) para constraint real
--    (índice parcial WHERE student_id IS NOT NULL não pode ser alvo de FK)
-- ══════════════════════════════════════════════════════════════════════
DROP INDEX IF EXISTS uq_vocabulary_items_id_student;

ALTER TABLE vocabulary_items
  ADD CONSTRAINT uq_vocabulary_items_id_student UNIQUE (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 1. student_vocabulary
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE student_vocabulary
  DROP CONSTRAINT IF EXISTS student_vocabulary_vocabulary_item_id_fkey;

ALTER TABLE student_vocabulary
  ADD CONSTRAINT sv_vocab_student_fk
    FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 2. reviews
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_vocabulary_item_id_fkey;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_vocab_student_fk
    FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 3. errors
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE errors
  DROP CONSTRAINT IF EXISTS errors_vocabulary_item_id_fkey;

ALTER TABLE errors
  ADD CONSTRAINT errors_vocab_student_fk
    FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 4. tense_practice  (sem FK de vocab ainda; adicionar a composta direto)
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE tense_practice
  ADD CONSTRAINT tp_vocab_student_fk
    FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 5. sentences — definir student_id NOT NULL e FK composta
--    5a. Preencher sentences sem student_id que ainda existam (segurança)
-- ══════════════════════════════════════════════════════════════════════
-- Apagar frases globais sem student_id (não pertencem a ninguém após T-023)
DELETE FROM sentences WHERE student_id IS NULL;

ALTER TABLE sentences
  ALTER COLUMN student_id SET NOT NULL;

-- 5b. Para sentences com vocabulary_item_id nulo, limpar (segurança)
DELETE FROM sentences WHERE vocabulary_item_id IS NULL;

ALTER TABLE sentences
  ALTER COLUMN vocabulary_item_id SET NOT NULL;

-- 5c. Substituir FK simples por composta
ALTER TABLE sentences
  DROP CONSTRAINT IF EXISTS sentences_vocabulary_item_id_fkey;

ALTER TABLE sentences
  ADD CONSTRAINT sentences_vocab_student_fk
    FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 6. contexts — adicionar student_id + FK composta para vocabulary_items
-- ══════════════════════════════════════════════════════════════════════
-- 6a. Adicionar coluna (nullable primeiro)
ALTER TABLE contexts
  ADD COLUMN IF NOT EXISTS student_id INTEGER;

-- 6b. Preencher student_id via vocabulary_items (que agora tem student_id NOT NULL)
UPDATE contexts c
SET student_id = vi.student_id
FROM vocabulary_items vi
WHERE c.vocabulary_item_id = vi.id
  AND c.student_id IS NULL;

-- 6c. Setar NOT NULL
ALTER TABLE contexts
  ALTER COLUMN student_id SET NOT NULL;

-- 6d. FK composta para vocabulary_items
ALTER TABLE contexts
  DROP CONSTRAINT IF EXISTS contexts_vocabulary_item_id_fkey;

ALTER TABLE contexts
  ADD CONSTRAINT contexts_vocab_student_fk
    FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items (id, student_id);

-- 6e. UNIQUE(id, student_id) em contexts para ser alvo de futura FK de reviews.context_practiced
ALTER TABLE contexts
  ADD CONSTRAINT uq_contexts_id_student UNIQUE (id, student_id);

-- ══════════════════════════════════════════════════════════════════════
-- 7. reviews.context_practiced → contexts via FK composta
--    (requer student_id no reviews, que já existe)
-- ══════════════════════════════════════════════════════════════════════
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_context_practiced_fkey;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_context_student_fk
    FOREIGN KEY (context_practiced, student_id)
    REFERENCES contexts (id, student_id)
    ON DELETE SET NULL;
