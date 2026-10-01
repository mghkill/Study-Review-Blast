-- Migration 005: ON DELETE CASCADE em vocabulary_items.student_id -> students (T-025)
--
-- Sem CASCADE, excluir um estudante viola a FK porque suas palavras ainda existem.
-- Com CASCADE, excluir o estudante remove todas as suas palavras,
-- que por sua vez (com CASCADE em student_vocabulary, reviews, etc.) remove todo o progresso.

ALTER TABLE vocabulary_items
  DROP CONSTRAINT IF EXISTS vocabulary_items_student_id_fkey;

ALTER TABLE vocabulary_items
  ADD CONSTRAINT vocabulary_items_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE;
