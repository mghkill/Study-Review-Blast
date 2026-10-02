-- Migration 006: Create canonical `tenses` table and migrate free-text tense columns
-- All changes run inside a single transaction (BEGIN/COMMIT handled by the migration runner).

-- 1. Create the canonical tenses lookup table
CREATE TABLE IF NOT EXISTS tenses (
  code       VARCHAR(60) PRIMARY KEY,
  lang       VARCHAR(10) NOT NULL DEFAULT 'en',
  label      VARCHAR(80) NOT NULL,
  sort_order SMALLINT    NOT NULL
);

-- 2. Seed canonical rows
INSERT INTO tenses (code, lang, label, sort_order) VALUES
  ('present_simple',             'en', 'Present Simple',             1),
  ('present_continuous',         'en', 'Present Continuous',         2),
  ('present_perfect',            'en', 'Present Perfect',            3),
  ('present_perfect_continuous', 'en', 'Present Perfect Continuous', 4),
  ('past_simple',                'en', 'Past Simple',                5),
  ('past_continuous',            'en', 'Past Continuous',            6),
  ('past_perfect',               'en', 'Past Perfect',               7),
  ('future',                     'en', 'Future',                     8),
  ('future_will',                'en', 'Future with will',           9),
  ('going_to',                   'en', 'Going to',                  10),
  ('modal_constructions',        'en', 'Modal constructions',       11),
  ('conditionals',               'en', 'Conditionals',              12)
ON CONFLICT (code) DO NOTHING;

-- 3. Helper function: normalise free-text label to code
CREATE OR REPLACE FUNCTION _tense_label_to_code(raw TEXT)
RETURNS VARCHAR(60) LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE lower(trim(raw))
    WHEN 'present simple'             THEN 'present_simple'
    WHEN 'present continuous'         THEN 'present_continuous'
    WHEN 'present perfect'            THEN 'present_perfect'
    WHEN 'present perfect continuous' THEN 'present_perfect_continuous'
    WHEN 'past simple'                THEN 'past_simple'
    WHEN 'past continuous'            THEN 'past_continuous'
    WHEN 'past perfect'               THEN 'past_perfect'
    WHEN 'future'                     THEN 'future'
    WHEN 'future with will'           THEN 'future_will'
    WHEN 'going to'                   THEN 'going_to'
    WHEN 'modal constructions'        THEN 'modal_constructions'
    WHEN 'conditionals'               THEN 'conditionals'
    WHEN 'conditional'                THEN 'conditionals'
    ELSE NULL
  END;
$$;

-- 4a. tense_practice
ALTER TABLE tense_practice ADD COLUMN IF NOT EXISTS tense_code VARCHAR(60);
UPDATE tense_practice SET tense_code = _tense_label_to_code(tense) WHERE tense_code IS NULL AND tense IS NOT NULL;
ALTER TABLE tense_practice ADD CONSTRAINT fk_tense_practice_tense_code FOREIGN KEY (tense_code) REFERENCES tenses(code);
ALTER TABLE tense_practice ALTER COLUMN tense_code SET NOT NULL;

-- 4b. sentences
ALTER TABLE sentences ADD COLUMN IF NOT EXISTS tense_code VARCHAR(60);
UPDATE sentences SET tense_code = _tense_label_to_code(tense) WHERE tense_code IS NULL AND tense IS NOT NULL AND trim(tense) <> '';
ALTER TABLE sentences ADD CONSTRAINT fk_sentences_tense_code FOREIGN KEY (tense_code) REFERENCES tenses(code);

-- 4c. reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS tense_practiced_code VARCHAR(60);
UPDATE reviews SET tense_practiced_code = _tense_label_to_code(tense_practiced) WHERE tense_practiced_code IS NULL AND tense_practiced IS NOT NULL;
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_tense_practiced_code FOREIGN KEY (tense_practiced_code) REFERENCES tenses(code);

-- 4d. errors
ALTER TABLE errors ADD COLUMN IF NOT EXISTS tense_code VARCHAR(60);
UPDATE errors SET tense_code = _tense_label_to_code(tense) WHERE tense_code IS NULL AND tense IS NOT NULL;
ALTER TABLE errors ADD CONSTRAINT fk_errors_tense_code FOREIGN KEY (tense_code) REFERENCES tenses(code);

-- 5. Recreate UNIQUE constraint on tense_practice using code
ALTER TABLE tense_practice DROP CONSTRAINT IF EXISTS tense_practice_student_id_vocabulary_item_id_tense_key;
ALTER TABLE tense_practice ADD CONSTRAINT uq_tense_practice_student_vocab_tense_code UNIQUE (student_id, vocabulary_item_id, tense_code);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_tense_practice_tense_code ON tense_practice(tense_code);
CREATE INDEX IF NOT EXISTS idx_sentences_tense_code      ON sentences(tense_code);
CREATE INDEX IF NOT EXISTS idx_reviews_tense_prac_code   ON reviews(tense_practiced_code);
CREATE INDEX IF NOT EXISTS idx_errors_tense_code         ON errors(tense_code);

-- NOTE: Legacy free-text columns kept for backward compatibility.
-- They will be dropped in a future migration after the API is updated.