# Usability Matrix

> This document maps all 20 physical tables in the database schema to their usage in the backend API and frontend screens. It identifies missing integrations and links them to the V2 Action Plan tasks that will resolve them.

| Table | Backend API Route | Frontend Screen / Functionality | Usability Status | V2 Resolution Task |
|---|---|---|---|---|
| `students` | `routes/students.js` | `StudentSelect.jsx`, `Dashboard.jsx`, etc. | ✅ Works | T-027, T-038 (ORM/TS) |
| `tenses` | `routes/tenses.js` | `Dashboard.jsx`, `VocabDetail.jsx` | ✅ Works | T-027, T-038 (ORM/TS) |
| `vocabulary_items` | `routes/vocabulary.js` | `VocabularyList.jsx`, `VocabDetail.jsx` | ✅ Works | T-031, T-032 (ORM/TS) |
| `student_vocabulary` | `routes/vocabulary.js`, `routes/reviews.js` | `ProgressPage.jsx`, `Dashboard.jsx`, `VocabDetail.jsx` | ✅ Works | T-031, T-034 (ORM/TS) |
| `verb_forms` | `routes/vocabulary.js` | `VocabDetail.jsx`, `AddVerb.jsx` | ✅ Works | T-031, T-032 (ORM/TS) |
| `meanings` | `routes/vocabulary.js` | `VocabDetail.jsx`, `AddVerb.jsx` | ✅ Works | T-031, T-032 (ORM/TS) |
| `contexts` | `routes/vocabulary.js` | `VocabDetail.jsx` | ⚠️ Partial (Missing Delete) | T-022 (`ON DELETE`) |
| `context_mastery` | `routes/vocabulary.js` (Read only) | No screen displays it clearly | ❌ Missing | T-080 |
| `sentences` | `routes/sentences.js`, `routes/vocabulary.js` | `SentencesPage.jsx` | ⚠️ Partial (Not in Study Mode) | T-069 (Sentence Generator) |
| `paragraphs` | `routes/sentences.js` | `ParagraphsPage.jsx` | ⚠️ Partial (Not in Study Mode) | T-066 (Paragraph Quizzes) |
| `paragraph_vocabulary` | `routes/sentences.js` | `ParagraphsPage.jsx` | ⚠️ Partial | T-066 (Paragraph Quizzes) |
| `student_sentences` | `routes/reviews.js` (Write only) | No screen | ❌ Missing | T-073 |
| `custom_quizzes` | `routes/sessions.js` (Validation only) | No route, no screen | ❌ Missing | T-060, T-061 (Custom Quizzes) |
| `custom_quiz_questions` | None | No route, no screen | ❌ Missing | T-060, T-061 (Custom Quizzes) |
| `pronunciation_practice`| `routes/reviews.js` (Write only) | No screen | ❌ Missing | T-075 (Speech Recognition) |
| `errors` | `routes/reviews.js`, `routes/dashboard.js`, `routes/vocabulary.js` | `ProgressPage.jsx`, `VocabDetail.jsx` | ✅ Works | T-034, T-029 (ORM/TS) |
| `reviews` | `routes/reviews.js`, `routes/dashboard.js` | `StudySession.jsx`, `Dashboard.jsx` | ✅ Works | T-033, T-034 (ORM/TS) |
| `study_sessions` | `routes/sessions.js`, `routes/dashboard.js` | `StudySession.jsx`, `Dashboard.jsx` | ✅ Works | T-028, T-029 (ORM/TS) |
| `tense_practice` | `routes/reviews.js`, `routes/dashboard.js`, `routes/vocabulary.js` | `ProgressPage.jsx`, `VocabDetail.jsx` | ✅ Works | T-034, T-029 (ORM/TS) |
| `schema_migrations` | DB engine only (`migrator.js`) | No screen | ⚠️ N/A (Internal) | T-018 (Add DB v00X to Sidebar) |

### Summary of Disconnected Features
- **Contexts:** Cannot be deleted via UI safely without cascading errors (T-022).
- **Paragraphs & Sentences:** Exist in the database and have basic CRUD pages, but do not interact with the spaced repetition `StudySession.jsx`.
- **Custom Quizzes:** Tables exist (`custom_quizzes`, `custom_quiz_questions`), but there are no API routes to create/list them, and no UI to manage them.
- **Student Sentences:** The backend saves student-created sentences during reviews, but there is no UI to view or review them later.
- **Pronunciation Practice:** The backend saves pronunciation accuracy, but there is no UI to show the history or train it explicitly.
- **Context Mastery:** Tracked by DB, read by vocabulary route, but has no dedicated visual representation in the detail cards.
