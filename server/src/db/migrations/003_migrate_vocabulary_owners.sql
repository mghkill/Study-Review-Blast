-- Migration 003: Migrar dados existentes — clonar vocabulary_items por estudante (T-023)
--
-- Conforme modelo-logico-alvo.md seção 2 (decisão D-02: preservar dados).
-- Para cada par (student_id, vocabulary_item_id) em student_vocabulary:
--   1. Clonar vocabulary_item com student_id preenchido
--   2. Clonar meanings, contexts, verb_forms ligados à palavra original
--   3. Remapear student_vocabulary, reviews, errors, sentences para os novos ids
--   4. Excluir palavras sem dono (student_id IS NULL)
--   5. Setar student_id NOT NULL em vocabulary_items
--
-- Tudo em uma transação única. Se falhar, nada muda.

DO $$
DECLARE
  rec             RECORD;
  new_vocab_id    INTEGER;
  old_ctx_id      INTEGER;
  new_ctx_id      INTEGER;
  v_before_vocab  INTEGER;
  v_before_sv     INTEGER;
  v_before_rev    INTEGER;
  v_before_err    INTEGER;
  v_before_sent   INTEGER;
  v_after_vocab   INTEGER;
  v_after_sv      INTEGER;
  v_after_rev     INTEGER;
  v_after_err     INTEGER;
  v_after_sent    INTEGER;
BEGIN
  -- ══════════════════════════════════════════════════════
  -- CONTAGENS ANTES
  -- ══════════════════════════════════════════════════════
  SELECT COUNT(*) INTO v_before_vocab FROM vocabulary_items;
  SELECT COUNT(*) INTO v_before_sv   FROM student_vocabulary;
  SELECT COUNT(*) INTO v_before_rev  FROM reviews;
  SELECT COUNT(*) INTO v_before_err  FROM errors;
  SELECT COUNT(*) INTO v_before_sent FROM sentences;

  RAISE NOTICE 'ANTES: vocab=% sv=% reviews=% errors=% sentences=%',
    v_before_vocab, v_before_sv, v_before_rev, v_before_err, v_before_sent;

  -- ══════════════════════════════════════════════════════
  -- TABELA TEMPORÁRIA DE MAPEAMENTO
  -- ══════════════════════════════════════════════════════
  CREATE TEMP TABLE IF NOT EXISTS vocab_id_map (
    student_id       INTEGER NOT NULL,
    old_vocab_id     INTEGER NOT NULL,
    new_vocab_id     INTEGER NOT NULL,
    PRIMARY KEY (student_id, old_vocab_id)
  );

  CREATE TEMP TABLE IF NOT EXISTS ctx_id_map (
    old_ctx_id   INTEGER NOT NULL,
    new_ctx_id   INTEGER NOT NULL,
    new_vocab_id INTEGER NOT NULL,
    PRIMARY KEY (old_ctx_id, new_vocab_id)
  );

  -- ══════════════════════════════════════════════════════
  -- 1. CLONAR vocabulary_items POR ESTUDANTE
  -- ══════════════════════════════════════════════════════
  FOR rec IN
    SELECT DISTINCT sv.student_id, vi.id AS vocab_id, vi.word, vi.type,
                    vi.level, vi.primary_meaning, vi.notes, vi.difficulty,
                    vi.is_irregular, vi.created_at
    FROM student_vocabulary sv
    JOIN vocabulary_items vi ON vi.id = sv.vocabulary_item_id
    WHERE vi.student_id IS NULL          -- apenas palavras sem dono
  LOOP
    -- Insere cópia com student_id definido
    INSERT INTO vocabulary_items
      (word, type, level, primary_meaning, notes, difficulty, is_irregular,
       student_id, created_at, updated_at)
    VALUES
      (rec.word, rec.type, rec.level, rec.primary_meaning, rec.notes,
       rec.difficulty, rec.is_irregular, rec.student_id,
       rec.created_at, NOW())
    RETURNING id INTO new_vocab_id;

    INSERT INTO vocab_id_map (student_id, old_vocab_id, new_vocab_id)
    VALUES (rec.student_id, rec.vocab_id, new_vocab_id);

    -- ── 1a. Clonar meanings ──────────────────────────────────────
    INSERT INTO meanings (vocabulary_item_id, meaning_text, language, sort_order, notes, created_at)
    SELECT new_vocab_id, meaning_text, language, sort_order, notes, created_at
    FROM meanings
    WHERE vocabulary_item_id = rec.vocab_id;

    -- ── 1b. Clonar contexts (e guardar mapa) ─────────────────────
    FOR old_ctx_id IN
      SELECT id FROM contexts WHERE vocabulary_item_id = rec.vocab_id
    LOOP
      INSERT INTO contexts (vocabulary_item_id, context_name, description, example_structure, created_at)
      SELECT new_vocab_id, context_name, description, example_structure, created_at
      FROM contexts
      WHERE id = old_ctx_id
      RETURNING id INTO new_ctx_id;

      INSERT INTO ctx_id_map (old_ctx_id, new_ctx_id, new_vocab_id)
      VALUES (old_ctx_id, new_ctx_id, new_vocab_id)
      ON CONFLICT DO NOTHING;
    END LOOP;

    -- ── 1c. Clonar verb_forms ────────────────────────────────────
    INSERT INTO verb_forms
      (vocabulary_item_id, base_form, past_simple, past_participle,
       third_person_singular, present_participle, created_at)
    SELECT new_vocab_id, base_form, past_simple, past_participle,
           third_person_singular, present_participle, created_at
    FROM verb_forms
    WHERE vocabulary_item_id = rec.vocab_id;

  END LOOP;

  -- ══════════════════════════════════════════════════════
  -- 2. ATUALIZAR student_vocabulary
  -- ══════════════════════════════════════════════════════
  UPDATE student_vocabulary sv
  SET vocabulary_item_id = m.new_vocab_id
  FROM vocab_id_map m
  WHERE sv.student_id = m.student_id
    AND sv.vocabulary_item_id = m.old_vocab_id;

  -- ══════════════════════════════════════════════════════
  -- 3. ATUALIZAR reviews
  -- ══════════════════════════════════════════════════════
  UPDATE reviews r
  SET vocabulary_item_id = m.new_vocab_id
  FROM vocab_id_map m
  WHERE r.student_id = m.student_id
    AND r.vocabulary_item_id = m.old_vocab_id;

  -- Atualizar context_practiced em reviews (se existir e estiver no mapa)
  UPDATE reviews r
  SET context_practiced = cm.new_ctx_id
  FROM ctx_id_map cm
  JOIN vocab_id_map vm ON cm.new_vocab_id = vm.new_vocab_id
  WHERE r.student_id = vm.student_id
    AND r.context_practiced = cm.old_ctx_id;

  -- ══════════════════════════════════════════════════════
  -- 4. ATUALIZAR errors
  -- ══════════════════════════════════════════════════════
  UPDATE errors e
  SET vocabulary_item_id = m.new_vocab_id
  FROM vocab_id_map m
  WHERE e.student_id = m.student_id
    AND e.vocabulary_item_id = m.old_vocab_id;

  -- ══════════════════════════════════════════════════════
  -- 5. ATUALIZAR sentences (apenas linhas com student_id definido)
  -- ══════════════════════════════════════════════════════
  UPDATE sentences s
  SET vocabulary_item_id = m.new_vocab_id
  FROM vocab_id_map m
  WHERE s.student_id IS NOT NULL
    AND s.student_id = m.student_id
    AND s.vocabulary_item_id = m.old_vocab_id;

  -- ══════════════════════════════════════════════════════
  -- 6. EXCLUIR palavras sem dono que não têm mais dependências
  -- ══════════════════════════════════════════════════════
  -- Apaga frase global (student_id NULL) de palavras que serão removidas
  DELETE FROM sentences
  WHERE student_id IS NULL
    AND vocabulary_item_id IN (SELECT id FROM vocabulary_items WHERE student_id IS NULL);

  -- Apaga a palavra sem dono — CASCADE remove meanings, contexts, verb_forms
  DELETE FROM vocabulary_items WHERE student_id IS NULL;

  -- ══════════════════════════════════════════════════════
  -- 7. ADICIONAR NOT NULL AGORA QUE TODAS TÊM DONO
  -- ══════════════════════════════════════════════════════
  ALTER TABLE vocabulary_items ALTER COLUMN student_id SET NOT NULL;

  -- ══════════════════════════════════════════════════════
  -- CONTAGENS DEPOIS
  -- ══════════════════════════════════════════════════════
  SELECT COUNT(*) INTO v_after_vocab FROM vocabulary_items;
  SELECT COUNT(*) INTO v_after_sv   FROM student_vocabulary;
  SELECT COUNT(*) INTO v_after_rev  FROM reviews;
  SELECT COUNT(*) INTO v_after_err  FROM errors;
  SELECT COUNT(*) INTO v_after_sent FROM sentences;

  RAISE NOTICE 'DEPOIS: vocab=% sv=% reviews=% errors=% sentences=%',
    v_after_vocab, v_after_sv, v_after_rev, v_after_err, v_after_sent;

  -- Verificação mínima de consistência
  IF v_after_sv != v_before_sv THEN
    RAISE EXCEPTION 'INCONSISTÊNCIA: student_vocabulary antes=% depois=%',
      v_before_sv, v_after_sv;
  END IF;

  RAISE NOTICE 'Migração 003 concluída com sucesso.';
END $$;
