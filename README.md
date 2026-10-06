# StudyReviewBlast

<div align="center">

**Personal spaced-repetition and active-recall platform for language learners with strict database-level multi-student data isolation and 100% offline local architecture.**

[![Node.js](https://img.shields.io/badge/Node.js-24-339933.svg?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#security-and-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#governance-and-contributing)

[About](#about-the-project) · [Getting Started](#getting-started) · [Stack & Versions](#technologies-and-versions) · [Plan V2](#action-plan-v2-and-phases) · [Technical Reports](#technical-reports-and-documentation) · [API Endpoints](#api-endpoints) · [Architectural Decisions](#architectural-decisions-explained) · [License](#security-and-license)

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
  - [Core Principles](#core-principles)
  - [Current Features](#current-features-implemented)
  - [Planned Features (Roadmap)](#planned-features-roadmap)
- [Technologies and Versions](#technologies-and-versions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-installing-dependencies)
  - [Environment Configuration](#2-environment-variables-configuration)
  - [Database Migration & Seeding](#3-database-migration-and-seeding)
  - [Running in Development](#4-starting-development-servers)
  - [Docker Setup (Optional)](#5-docker-environment-optional)
- [Daily Workflow and Resuming Work](#daily-workflow-and-resuming-work)
  - [A Day's Work Algorithm](#a-days-work-algorithm)
  - [How to Resume After Interruption](#how-to-resume-after-an-interruption)
- [Action Plan V2 and Phases](#action-plan-v2-and-phases)
- [Technical Reports and Documentation](#technical-reports-and-documentation)
- [API Endpoints](#api-endpoints)
- [Project Directory Structure](#project-directory-structure)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Architectural Decisions Explained](#architectural-decisions-explained)
- [Post-Trial Improvements Backlog](#post-trial-improvements-backlog)
- [Governance and Contributing](#governance-and-contributing)
- [Security and License](#security-and-license)

---

## About the Project

**StudyReviewBlast** is an open-source platform tailored to master language vocabulary, verb forms, and contextual grammar through **Spaced Repetition Systems (*SRS*)** and **Active Recall**.

Unlike conventional platforms that require perpetual cloud connectivity, paid subscriptions, or vendor-locked AI APIs, StudyReviewBlast is engineered from the ground up to operate **100% locally, independently, and free of charge**, providing total privacy and sovereign control over study data.

### Core Principles

1. **100% Free and Local:** Zero external paid APIs (no proprietary OpenAI, Claude, or Gemini API keys required), zero cloud TTS services (no ElevenLabs), and zero managed database subscription fees. Everything runs locally on your workstation.
2. **Multi-Student Support with Strict Isolation:** Multiple learners can share a single machine or browser. Every student owns an isolated catalog of words, example sentences, retention metrics, and error logs, structurally separated at the database level using composite foreign keys `(id, student_id)`.
3. **No-Login Frictionless Desktop Operation:** Eliminates the overhead of password hashing, sign-ups, or JWT tokens for local desktop usage. Profiles are switched in the frontend and secured on the API via the `X-Student-Id` header enforced by the `requireStudent` middleware.
4. **PostgreSQL 18 Sovereignty:** The relational database remains the ultimate source of truth. Integrity constraints, composite keys, and versioned transactional SQL migrations govern the domain model.

### Current Features (Implemented)

- [x] **Strict Multi-Student Isolation:** Composite foreign keys across all dependent tables (`vocabulary_items`, `sentences`, `contexts`, `reviews`, `errors`) prevent accidental data crossover between student profiles.
- [x] **Native Versioned Migration Runner:** Idempotent, transactional pure-Node.js migration engine (`server/src/db/migrator.js`) tracking executions in the `schema_migrations` table (9 migrations currently applied and verified).
- [x] **Comprehensive Vocabulary Catalog:** Vocabulary management covering verbs, meanings, usage contexts, example sentences, and associated canonical verb tenses.
- [x] **Heuristic SRS Review Queue:** Smart scheduling based on recall difficulty, calculation of dynamic review intervals, and diagnostic error analysis grouped by category.
- [x] **Student Sentence Composition:** Learners can draft and persist custom sentences during active review sessions.
- [x] **Canonical 12 English Verb Tenses:** Dedicated relational structure for functional grammar and verb conjugation practice.
- [x] **Native Browser Speech Synthesis:** Text-to-speech audio powered by the browser's native `SpeechSynthesis` (Web Speech API) with zero network dependency.
- [x] **Analytical Dashboard:** Visual retention charts, study volume, and error frequency metrics powered by Chart.js.

### Planned Features (Roadmap)

- [ ] **State-of-the-Art FSRS Algorithm:** Full integration of the Free Spaced Repetition Scheduler (`ts-fsrs`), Anki-style response buttons (*Again / Hard / Good / Easy*), retention forecasting, and native SVG/CSS activity heatmaps (Phase 10).
- [ ] **Persisted Custom Quizzes:** Creation and scoring of targeted 5-to-10 question quiz blocks backed by relational `custom_quizzes` tables (Phase 10).
- [ ] **Offline Rule-Based Sentence Generator:** Template-driven sentence creation utilizing irregular verb forms without external AI (Phase 10).
- [ ] **Bilingual Interface & Full i18n:** Localization system built on `i18next` enabling seamless switching between English and Portuguese (Phase 9).
- [ ] **Incremental TypeScript Migration:** Gradual adoption of static typing across backend routes, repositories, and frontend API contracts (Phase 6).
- [ ] **Drizzle ORM Adoption with CI Schema Drift Check:** Type-safe database repositories while retaining pure SQL migrations as the source of truth (Phase 5).
- [ ] **Optional Speech Recognition:** Pronunciation feedback matching spoken input against expected sentences using local speech recognition (Phase 11).

---

## Technologies and Versions

The project is built on an audited, high-performance stack. All versions below are exact matches extracted directly from package manifests (`package.json`) and package lockfiles (`package-lock.json`):

<!-- stack:start -->
| Layer | Technology | Declared Version | Lockfile Version | Architectural Role | Origin |
|---|---|---|---|---|---|
| **Language & Runtime** | Node.js | `>= 24.0.0` | `24.x` | Backend JavaScript runtime and build tooling | Host Environment |
| **Database** | PostgreSQL | `18` | `18.x` | Relational database and schema integrity engine | Local Service / Docker |
| **Database Driver** | `pg` | `^8.11.3` | `8.23.1` | Native PostgreSQL connection pool and query driver | `server/package.json` |
| **Backend Framework** | Express | `^4.18.2` | `4.22.3` | HTTP web application framework for REST API | `server/package.json` |
| **Frontend Framework** | React | `^19.2.8` | `19.3.0` | Declarative reactive user interface library | `client/package.json` |
| **Build & Dev Server** | Vite | `^8.3.0` | `8.3.1` | Next-generation frontend bundler and HMR server | `client/package.json` |
| **Frontend Routing** | `react-router-dom` | `^7.18.4` | `7.18.4` | Client-side routing and layout orchestration | `client/package.json` |
| **HTTP Client** | Axios | `^1.20.0` | `1.20.0` | HTTP client with automatic `X-Student-Id` interceptor | `client/package.json` |
| **Data Visualization** | `chart.js` / `react-chartjs-2` | `^4.5.1` / `^5.3.1` | `4.5.1` | Canvas-based charts for study retention analytics | `client/package.json` |
| **Backend Testing** | Jest | `^29.7.0` | `29.7.0` | Test runner for backend unit and integration suites | `server/package.json` |
| **HTTP Integration Testing** | Supertest | `^7.3.0` | `7.3.0` | Programmatic HTTP endpoint testing | `server/package.json` |
| **Frontend Testing** | Vitest | `^5.0.3` | `5.0.3` | Vite-native test runner for frontend components | `client/package.json` |
| **Frontend Linter** | Oxlint | `^1.81.0` | `1.81.0` | Rust-based high-speed static analyzer for React | `client/package.json` |
<!-- stack:end -->

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js 24+** (`node --version`)
- **npm 10+** (`npm --version`)
- **PostgreSQL 18** running locally on port `5432` (or Docker Desktop for containerized execution)
- **Python 3.10+** (accessible as `py` or `python`) for the action plan CLI automation tool

---

### 1. Installing Dependencies

Clone the repository and install the dependencies for each package independently:

```bash
git clone https://github.com/mghkill/Study-Review-Blast.git
cd Study-Review-Blast

# Install backend and frontend dependencies
npm install --prefix server
npm install --prefix client
```

---

### 2. Environment Variables Configuration

Copy the sample environment template to create your local server configuration:

```bash
cp .env.example .env
```

Edit the newly created `.env` file with your local PostgreSQL credentials:

| Variable | Required | Description | Safe Example Value |
|---|---|---|---|
| `DB_HOST` | **Yes** | Host address of the PostgreSQL service | `localhost` |
| `DB_PORT` | **Yes** | Port number of the PostgreSQL service | `5432` |
| `DB_NAME` | **Yes** | Relational database name | `reviewdatabase` |
| `DB_USER` | **Yes** | Database user name | `postgres` |
| `DB_PASSWORD` | **Yes** | Database password | *(your_local_password)* |
| `PORT` | No | HTTP listening port for the Express API | `3001` |
| `NODE_ENV` | No | Execution environment (`development` / `production`) | `development` |

> [!IMPORTANT]
> The `.env` file contains sensitive credentials and is **strictly ignored by Git** (configured in [`.gitignore`](./.gitignore)). Only commit or share configurations via [`.env.example`](./.env.example).

---

### 3. Database Migration and Seeding

With PostgreSQL running and the target database created, execute the migrations and optional seed data:

```bash
# Apply all pending SQL migrations in order
npm run migrate --prefix server

# Optional: Populate demo student and starter vocabulary
npm run seed --prefix server
```

---

### 4. Starting Development Servers

Launch both backend and frontend development servers in separate terminals:

```bash
# Terminal 1 — Backend API (Express on port 3001)
npm run dev --prefix server

# Terminal 2 — Frontend SPA (Vite on port 5173)
npm run dev --prefix client
```

Open your browser at:
- **Application Web UI:** [http://localhost:5173](http://localhost:5173)
- **API Health Check:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

### 5. Docker Environment (Optional)

In accordance with architectural decision **D-11**, Docker is entirely optional:
- For Docker Desktop users, Compose is configured to bind PostgreSQL to an alternative port (e.g., `5433:5432`), preventing conflicts with native PostgreSQL on `5432`.
- The full test suite, migrations, and developer scripts run natively without requiring containerization.

---

## Daily Workflow and Resuming Work

Development on StudyReviewBlast follows an atomic governance protocol (**one task per session**), preventing context degradation and guaranteeing verifiable progress.

### A Day's Work Algorithm

Follow this exact step-by-step sequence in every coding session:

```text
1. py plano-de-acao/plan_tool.py status
2. Read plano-de-acao/PLANO.md → section "## PRÓXIMO PASSO"
3. Read plano-de-acao/TAREFAS.md → specific task card (### T-0XX)
4. Read the last 20 lines of plano-de-acao/LINHA-DO-TEMPO.md
5. Run git status and git log -3 --oneline
─────────────────────────────────────────────────────────────────
6. Mark task as started: py plano-de-acao/plan_tool.py start T-0XX
7. Write the test BEFORE implementation and observe it FAIL (TDD)
8. Implement code until all tests pass cleanly
─────────────────────────────────────────────────────────────────
MANDATORY PAUSE (plano-de-acao/RETOMAR.md §3):
9. Run test suites and linters (npm test --prefix server / client)
10. Run git add . (always executed from the repository root)
11. Run git commit -m "feat/fix(scope): conventional commit message"
12. Finalize task: py plano-de-acao/plan_tool.py done T-0XX --nota "summary & verification"
13. STOP — Do not begin the next task without explicit instruction
```

### How to Resume After an Interruption

If your session terminates due to context window limits, client switching, or reboot:

1. Check whether a task is marked as in-progress `[~]` in [`plano-de-acao/PLANO.md`](./plano-de-acao/PLANO.md).
2. If none is active, run:
   ```powershell
   py plano-de-acao/plan_tool.py status
   ```
3. Consult the resumption guide in [`plano-de-acao/RETOMAR.md`](./plano-de-acao/RETOMAR.md).
4. Provide the AI prompt:
   ```text
   Read plano-de-acao/RETOMAR.md and execute T-0XX.
   ```

---

## AI Development Skills & Prompts

This repository is designed to be co-developed with agentic AI assistants. It includes predefined prompts and custom skills to guide the AI's behavior reliably without losing context:

### 1. Operational Execution (The "T" Tasks)
* **Skill:** `studyreviewblast-planner` (located in [`skills/SKILLENG.md`](./skills/SKILLENG.md))
* **Purpose:** Drives the day-to-day execution of the project. It forces the AI to follow the atomic workflow (1 task per session), write tests first, and pause for commits.
* **How to use:** Trigger the skill and prompt the AI with:
  > `Leia plano-de-acao/RETOMAR.md e execute a T-0XX.`

### 2. Planning Refinement (The "M" Tasks)
* **Skill:** `SKILL-MELHORIA-PLANO` (obsoleta, preservada em [`plano-de-acao/legado/SKILL-MELHORIA-PLANO.md`](./plano-de-acao/legado/SKILL-MELHORIA-PLANO.md))
* **Purpose:** Allows the AI to audit the project and improve the action plan itself without touching source code.
* **How to use:** O projeto agora utiliza as skills nativas do diretório `.agents/skills/`. O antigo processo (preservado em [`plano-de-acao/legado/CENTRAL_IDEA.md`](./plano-de-acao/legado/CENTRAL_IDEA.md)) foi superado pelo novo ecossistema.

### 3. Open Source Documentation
* **Skill:** `readme-open-source` (located in [`skills/skill.md`](./skills/skill.md))
* **Purpose:** Instructs the AI to analyze the actual codebase and generate/update this README file with accurate stack versions and setup instructions.

---

## Action Plan V2 and Phases

The development roadmap is structured into **15 core phases** plus approved expansion modules, encompassing **97 atomic tasks**:

> **Current Progress:** 4 / 97 tasks completed (4%) · **Next Task:** `T-002`

| Phase | Phase Title | Task Scope | Key Deliverables | Status |
|---|---|---|---|---|
| **Phase 1** | Safety Net & Baseline | T-001 to T-004 | Clean branch, verified backup (`pg_dump -Fc`), baseline test metrics, usability matrix | In Progress (T-001 ✔) |
| **Phase 2** | Tooling & Code Quality | T-005 to T-011 | Root package.json, ESLint Flat, Prettier, Husky, lint-staged, commitlint, GitHub Actions CI | Pending |
| **Phase 3** | Reproducible Environment | T-012 to T-015 | Isolated `<DB_NAME>_test` database, Zod-validated `.env`, optional compose.yml | Pending |
| **Phase 4** | Versioned Migrations & SQL Logic | T-016 to T-024 | Node migration runner, SHA-256 checksums, `updated_at` triggers, foreign key indexes | In Progress (T-016, T-017 ✔) |
| **Phase 5** | ORM (Drizzle) | T-025 to T-035 | Schema introspection, student-scoped repositories, CI drift checks, anti-concatenation lint rules | Pending |
| **Phase 6** | Incremental TypeScript | T-036 to T-041 | Typed backend (routes, middleware, services) and typed frontend contracts (`api.ts`) | Pending |
| **Phase 7** | Security & Resilience | T-042 to T-049 | Centralized JSON error sanitization, Zod route schemas, Helmet, rate limiting, Pino logging | Pending |
| **Phase 8** | Student Isolation | T-050 to T-053 | Composite FK verification, instant profile switcher in Sidebar, friendly empty states | In Progress (T-050 ✔) |
| **Phase 9** | Localization & i18n | T-054 to T-063 | Full `i18next` integration (`en` and `pt-BR`), UI string extraction, backend messages in English | Pending |
| **Phase 10** | Study Experience & FSRS | T-064 to T-078 | FSRS scheduler (`ts-fsrs`), Anki-style cards with interval previews, custom quizzes, heatmaps | Pending |
| **Phase 11** | Native Voice (Speech API) | T-079 to T-081 | Text-to-speech voice preferences, optional speech recognition, pronunciation practice logs | Pending |
| **Phase 12** | End-to-End Testing (E2E) | T-082 to T-085 | Playwright suites for study flows and student isolation, CI artifact test reports | Pending |
| **Phase 13** | Documentation & Open Source | T-086 to T-091 | Interactive Swagger UI (`/api/docs`), community files (`CONTRIBUTING.md`, `LICENSE`), screenshots | Pending |
| **Phase 14** | Production Trial (Trial by Fire) | T-092 | Clean clone on a fresh machine validating README setup from scratch | Pending |
| **Phase 15** | Final Translation | T-093 to T-094 | Cross-linked English and Portuguese READMEs (`README.en.md` / `README.pt-BR.md`), plus optional internal planning translation | Pending |
| **Module 1** | Pre-ORM API Sanitization | T-095 | Strict parameterization of `LIMIT`/`OFFSET` and internal error message masking | Pending |
| **Module 2** | Legacy Test Stabilization | T-096 to T-097 | Fix legacy frontend tests (`srs.test.js`, `tts.test.js`) and server review status check | Pending |

---

## Technical Reports and Documentation

The repository maintains an audited documentation corpus. Refer to these dedicated reports for architectural depth, governance, and audit trails:

| Report | Relative Path | Core Purpose and Scope |
|---|---|---|
| **Master Architectural Report** | [`plano-de-acao/RELATORIO-GERAL-PROJETO.md`](./plano-de-acao/RELATORIO-GERAL-PROJETO.md) | **Primary Architectural Guide:** Core principles, physical directory X-ray, real state breakdown, target system vision, and non-negotiable rules. |
| **Daily Operations Protocol** | [`plano-de-acao/RETOMAR.md`](./plano-de-acao/RETOMAR.md) | **Operations Manual:** Canonical reading sequence, token limit recovery steps, and mandatory commit-pause flow. |
| **Operational Action Plan** | [`plano-de-acao/PLANO.md`](./plano-de-acao/PLANO.md) | **Sequence of Execution:** 15 phases, formal decisions D-01 through D-18, approved dependency list (D-10), and active pointer. |
| **Atomic Task Cards** | [`plano-de-acao/TAREFAS.md`](./plano-de-acao/TAREFAS.md) | **Unit Specifications:** 97 detailed task cards outlining Objective, Backend, Frontend, Required Pre-Tests, and Done Criteria. |
| **Auditable Timeline** | [`plano-de-acao/LINHA-DO-TEMPO.md`](./plano-de-acao/LINHA-DO-TEMPO.md) | **Immutable History:** Append-only chronological log of executed actions, timestamps, backup hashes, and validation proofs. |
| **Security & Isolation Model** | [`docs/seguranca-e-isolamento.md`](./docs/seguranca-e-isolamento.md) | **Security Analysis:** Data ownership mechanics, composite FK protections, desktop no-login boundaries, and cloud recommendations. |
| **Engineering Conventions** | [`skills/references/convencoes-v2.md`](./skills/references/convencoes-v2.md) | **Standards:** Code conventions, branching models (`v2/phase-NN-slug`), Conventional Commits, and test architecture. |
| **Target Relational Model** | [`skills/references/modelo-logico-alvo.md`](./skills/references/modelo-logico-alvo.md) | **Database Design:** Relational schema design, composite referential integrity, indexes, and PostgreSQL 18 nuances. |
| **Legacy V1 → V2 Mapping** | [`plano-de-acao/legado/MAPA-V1-V2.md`](./plano-de-acao/legado/MAPA-V1-V2.md) | **Legacy Traceability:** Line-by-line mapping of initial V1 tasks preserved or reorganized into Plan V2. |
| **V2 Reconstruction Report** | [`plano-de-acao/legado/RELATORIO-RECONSTRUCAO-V2.md`](./plano-de-acao/legado/RELATORIO-RECONSTRUCAO-V2.md) | **Engineering Record:** Technical history of the transition from legacy planning to the V2 architecture. |

---

## API Endpoints

The API conforms to REST principles. Except for public health checks `/api/health` and the profile catalog `/api/students`, **all endpoints require the `X-Student-Id: <id>` HTTP header**.

```text
Required Header: X-Student-Id: <student_id>
```

| Method | Endpoint | Required Header | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Service liveness probe and PostgreSQL database connectivity check |
| `GET`, `POST` | `/api/students` | None | List student profiles or create a new student |
| `GET`, `PATCH`, `DELETE` | `/api/students/:id` | None | Fetch details, update, or delete a student profile (cascades safely) |
| `GET` | `/api/tenses` | `X-Student-Id` | List canonical 12 English verb tenses |
| `GET`, `POST` | `/api/vocabulary` | `X-Student-Id` | List student vocabulary or create a new vocabulary item |
| `GET`, `PATCH`, `DELETE` | `/api/vocabulary/:id` | `X-Student-Id` | Retrieve details, edit, or delete a student's vocabulary item |
| `POST` | `/api/vocabulary/:id/sentences` | `X-Student-Id` | Attach an example sentence to a vocabulary item |
| `POST` | `/api/vocabulary/:id/contexts` | `X-Student-Id` | Attach a usage context to a vocabulary item |
| `PATCH` | `/api/vocabulary/:id/meanings/:mId`| `X-Student-Id` | Update a specific meaning on a vocabulary item |
| `GET` | `/api/reviews/queue` | `X-Student-Id` | Retrieve due spaced repetition (SRS) review items |
| `POST` | `/api/reviews` | `X-Student-Id` | Record a review response and calculate next interval |
| `GET` | `/api/reviews/history` | `X-Student-Id` | Retrieve chronological review submission history |
| `GET` | `/api/reviews/errors` | `X-Student-Id` | Fetch diagnostic error counts grouped by category |
| `POST` | `/api/reviews/student-sentence` | `X-Student-Id` | Persist custom sentence created by the student during study |
| `POST` | `/api/sessions` | `X-Student-Id` | Start a new tracked study session |
| `PATCH` | `/api/sessions/:id` | `X-Student-Id` | Conclude an active study session and save performance metrics |
| `GET` | `/api/dashboard` | `X-Student-Id` | Aggregated student KPIs, retention rates, and summary counts |
| `GET`, `POST` | `/api/sentences` | `X-Student-Id` | Query or create student sentences |
| `GET`, `POST` | `/api/sentences/paragraphs` | `X-Student-Id` | Query or create reading comprehension paragraphs |

---

## Project Directory Structure

```text
Study-Review-Blast/
├── .env.example                       # Environment variables template (no secrets)
├── .gitignore                         # Git exclusion rules (node_modules, logs, .env)
├── README.md                          # Repository master guide and documentation
│
├── client/                            # FRONTEND — Single Page Application (React 19 + Vite 8)
│   ├── package.json                   # Client scripts and dependencies
│   ├── index.html                     # Root application HTML entry point
│   ├── vite.config.js                 # Vite configuration and /api proxy configuration
│   └── src/
│       ├── main.jsx                   # React DOM bootstrapping
│       ├── App.jsx                    # Route hierarchy and main layout
│       ├── api.js                     # Axios client with X-Student-Id interceptor
│       ├── index.css                  # Custom dark/glassmorphic design system
│       ├── context/                   # Global React state (active student context)
│       │   └── AppContext.jsx
│       ├── pages/                     # Full-page view components
│       │   ├── Dashboard.jsx          # KPI overview, study cards, and metric widgets
│       │   ├── StudySession.jsx       # Interactive study and active-recall session
│       │   ├── VocabularyPage.jsx     # Filterable vocabulary catalog
│       │   ├── VocabDetail.jsx        # Term detail, meanings, contexts, and tenses
│       │   ├── AddVerb.jsx            # Structured vocabulary registration form
│       │   ├── SentencesPage.jsx      # Sentence bank grouped by verb tense
│       │   ├── ParagraphsPage.jsx     # Contextual reading passages
│       │   ├── SearchPage.jsx         # Global cross-entity text search
│       │   └── ProgressPage.jsx       # Chart.js analytical charts for retention
│       ├── components/                # Modular UI components (Sidebar, Badges, Modals...)
│       ├── hooks/                     # Custom React hooks (useSpeech, useTenses...)
│       ├── utils/                     # Formatting utilities and speech helpers
│       └── test/                      # Vitest test suite (isolation & SRS calculations)
│
├── server/                            # BACKEND — REST API (Node.js 24 + Express)
│   ├── package.json                   # Server scripts and dependencies
│   ├── src/
│   │   ├── index.js                   # Express server entry point (port 3001)
│   │   ├── routes/                    # REST API route handlers
│   │   │   ├── students.js            # Profile management CRUD
│   │   │   ├── vocabulary.js          # Vocabulary, meanings, and contexts
│   │   │   ├── reviews.js             # SRS review queues and history
│   │   │   ├── sessions.js            # Study session tracking
│   │   │   ├── sentences.js           # Sentence and paragraph persistence
│   │   │   ├── tenses.js              # Canonical English verb tenses
│   │   │   └── dashboard.js           # Analytics aggregation endpoint
│   │   ├── middleware/
│   │   │   └── requireStudent.js      # Middleware enforcing X-Student-Id header
│   │   ├── services/
│   │   │   └── srs.js                 # Spaced repetition scheduling service
│   │   └── db/
│   │       ├── connection.js          # PostgreSQL pg connection pool
│   │       ├── migrator.js            # Pure-Node transactional migration runner
│   │       ├── migrate.js             # CLI script to execute migrations
│   │       ├── seed.js                # CLI script to seed sample data
│   │       └── migrations/            # Versioned SQL migrations (001 to 009)
│   └── tests/                         # Jest + Supertest suites (integration & isolation)
│
├── docs/                              # Technical architecture and domain documents
│   └── seguranca-e-isolamento.md      # Security analysis and isolation audit
│
├── plano-de-acao/                     # OPERATIONAL ACTION PLAN V2 ENGINE
│   ├── PLANO.md                       # Active plan status, 15 phases, and decisions
│   ├── TAREFAS.md                     # Detailed cards for all 97 tasks
│   ├── RETOMAR.md                     # Daily workflow and pause rules
│   ├── LINHA-DO-TEMPO.md              # Immutable historical execution log
│   ├── plan_tool.py                   # Automation CLI tool for plan tracking
│   ├── RELATORIO-GERAL-PROJETO.md     # Master architectural report
│   └── legado/                        # Preserved historical Plan V1 archives
│
└── skills/                            # ENGINEERING SKILLS & STANDARDS PACKAGE
    ├── SKILLENG.md                    # Technical planning and engineering rules
    ├── skill.md                       # Open-source README creation skill
    ├── references/                    # Code conventions, commits, and relational models
    ├── assets/                        # Templates and documentation skeletons
    └── scripts/                       # Stack detection scripts and CLI utilities
```

---

## Testing and Quality Assurance

The codebase enforces strict test-driven development and automated linting:

```bash
# Backend — Run Jest integration and unit test suite
npm test --prefix server

# Backend — Run Jest in watch mode during development
npm run test:watch --prefix server

# Frontend — Run Vitest suite
npm run test:run --prefix client

# Frontend — Run Oxlint high-speed static analyzer
npm run lint --prefix client

# Production dependency vulnerability audit
npm audit --omit=dev --prefix server
npm audit --omit=dev --prefix client
```

---

## Architectural Decisions Explained

Every architectural choice has been debated, documented, and formally decided:

| ID | Topic | Adopted Decision | Plain-English Rationale | Status |
|---|---|---|---|---|
| **D-01** | Data Ownership | **Strict Student Ownership** | Every vocabulary entry belongs exclusively to the student who created it. Two students may study the same word, but each has an isolated copy. | **Decided** |
| **D-02** | Development Database | **Preserve Development Data** | Existing development data is never wiped. Work is protected by migrations, and automated tests execute in an isolated database (`_test`). | **Decided** |
| **D-03** | License & Copyright | **MIT** (`Copyright 2026 mghkill`) | Universally recognized, permissive, and standard open-source license. | **Decided** |
| **D-04** | Authentication | **`X-Student-Id` Header** | Eliminates login friction for local single-machine usage. Enforced on the server via `requireStudent` middleware. | **Decided** |
| **D-05** | ORM Layer | **Drizzle ORM** | Lightweight, type-safe queries without the operational weight or schema locks of heavier ORMs. | **Decided** |
| **D-06** | Schema Source of Truth | **Native SQL Migrations** | Plain SQL migrations remain the supreme source of truth. Drizzle schema is kept in sync via automated CI drift checks. | **Decided** |
| **D-07** | TypeScript Adoption | **Incremental Adoption (Phase 6)** | Phased adoption starting with backend services and API routes, extending to client API contracts without breaking working features. | **Decided** |
| **D-08** | Documentation Language | **English Documentation** | Master README is maintained in English to maximize accessibility in the global open-source ecosystem. | **Decided** |
| **D-09** | Root `package.json` | **Tooling & Orchestration Only** | Dedicated solely to repo-level linters, commit hooks, and unified test orchestration, leaving inner package scripts untouched. | **Decided** |
| **D-10** | Approved Dependencies | **Strict Allowlist** | Only approved free, open-source packages registered in `PLANO.md` may be added to dependencies. | **Decided** |
| **D-11** | Docker Environment | **Optional Containerization** | Supports Docker Desktop optionally on port `5433:5432`, but native local PostgreSQL remains the primary default. | **Decided** |
| **D-12** | Test Database | **Dedicated Test DB (`<DB_NAME>_test`)** | Automated tests run against an isolated test database, guaranteeing development data is never contaminated. | **Decided** |
| **D-13** | Git Workflow | **One Branch Per Phase** | Branches follow `v2/phase-NN-slug`, merged into main through pull request reviews upon phase completion. | **Decided** |
| **D-14** | SRS Algorithm | **FSRS (`ts-fsrs`)** | Modern Free Spaced Repetition Scheduler based on memory stability and difficulty supersedes legacy heuristics. | **Decided** |
| **D-15** | Interface Language | **Default English (`en`) with Selector** | Defaults to browser language with English fallback and interactive language toggle persisted in browser storage. | **Decided** |
| **D-16** | Planning Translation | **Optional Post-Trial Translation** | Internal planning translation is optional and scheduled only after completing the Trial by Fire (T-092). | **Decided** |
| **D-17** | Frontend Linter | **Oxlint Kept for Frontend** | Retains Oxlint's superior linting speed for React, applying ESLint to the server and shared Prettier formatting. | **Decided** |
| **D-18** | Voice & Pronunciation | **Native Local Web Speech API** | Prefers local browser voices (`localService=true`). Avoids sending audio data to third-party transcription services. | **Decided** |
| **D-19** | Technical Language | **Strict English Standard** | All source code, folders, commits, and code comments must be strictly in English (except for app-specific learning data). | **Decided** |

---

## Autonomous AI Agents & Custom Skills

This repository features a robust, self-documenting ecosystem of custom skills for autonomous AI agents (like Google Antigravity). These skills ensure strict project governance, security, and continuous maintenance without human micromanagement.

All skills are natively loaded from `.agents/skills/`:
- **`studyreviewblast-planner`**: The core engineering skill that strictly enforces TDD, no-secrets policies, and database migration rules.
- **`gerador-de-m`**: Automates the creation of architectural improvement plans (`M-xx`) before any code is touched, enforcing planning-first development.
- **`project-oracle`**: The context search engine. Forces the AI to read the timeline and reports before answering user questions to eliminate hallucinations.
- **`hierarchy-sync`**: Ensures that architectural updates cascade correctly (Logs -> Reports -> README) to prevent documentation asymmetry.
- **`brain-sync`**: Deep context initializer. Forces the AI to read global rules, skill catalogs, and master prompts before starting complex work.
- **`crash-recovery`**: Recovers context from sudden failures (e.g., token limits) to ensure seamless resumption.
- **`safe-cleanup`**: A governance skill that prevents accidental deletion of files, demanding formal justification and user approval before moving legacy data.
- **`markdown-doctor`**: An autonomous documentation healer that scans and fixes broken markdown links across the repository.
- **`prompt-updater`**: Automatically injects new capabilities into the master prompt catalog (`PROMPTS_MESTRES.md`).
- **`readme-open-source`**: Analyzes the repository stack and automatically generates/updates this professional README.

To view the master rules these agents obey, see `.agents/rules/global_rules.md`.

---

## Post-Trial Improvements Backlog

High-value features intentionally deferred beyond Plan V2 to uphold the principles of zero cost and local execution:

| Enhancement | Estimated Cost | When to Consider |
|---|---|---|
| **Password / OAuth2 Authentication** | Free to build / Hosting ~$5–20/mo | If migrating from local desktop usage to public web hosting |
| **Cloud Hosting (Render / Fly.io)** | ~$5 to $20 / month | After full validation through the Trial by Fire (T-092) |
| **Ultra-Realistic Cloud TTS (ElevenLabs)** | ~$0.016 per 1k characters | If native browser speech synthesis does not meet audio quality needs |
| **Commercial AI Sentence Generation** | ~$0.002 to $0.03 per 1k tokens | If offline rule-based templating proves too rigid |
| **Error Monitoring (Sentry)** | Free tier up to 5k events/mo | Upon deploying the application to an external server |
| **Row-Level Security (RLS) in PostgreSQL** | Free | If refactoring the architecture into a multi-tenant cloud SaaS |

---

## Governance and Contributing

Contributions to **StudyReviewBlast** are welcome! To preserve system integrity, please observe the following standards:

1. **Branches:** Branch off the active phase branch:
   ```bash
   git checkout -b feat/my-improvement
   ```
2. **Commit Standard:** Adhere to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
   ```bash
   git commit -m "feat(vocabulary): add export to json functionality"
   ```
3. **Test-Driven:** All new capabilities must be covered by automated tests (Jest on the server, Vitest on the client).
4. **Data Isolation:** Any new route or entity touching student records must strictly require and validate `student_id`.

For comprehensive guidelines, refer to the [Engineering Conventions](./skills/references/convencoes-v2.md).

---

## Security and License

- **Security Model & Boundaries:** The application is architected for personal desktop or trusted local network use. Refer to the [Security and Isolation Analysis](./docs/seguranca-e-isolamento.md) to understand protection boundaries.
- **License:** Distributed under the **MIT License** (formal LICENSE file scheduled for Phase 13 / T-087). Standard terms:

```text
Copyright (c) 2026 mghkill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
Engineered for reliable language acquisition and software excellence.
</div>
