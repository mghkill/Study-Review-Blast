# StudyReviewBlast

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue.svg)](https://www.postgresql.org/)

> A personal Spaced Repetition System (SRS) and dynamic Active Recall training platform for accelerated retention of English vocabulary, verbs, and grammatical structures.

**StudyReviewBlast** blends cognitive science principles (*Spaced Repetition System* and *Active Recall*) to turn language acquisition into an active, high-retention habit. The system prioritizes items with high error frequency, dynamically organizes customizable quiz blocks of 5 or 10 questions, and prompts learners with contextual clues and cloze-test sentence completions before revealing answers.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [System Architecture & Logical Data Model](#-system-architecture--logical-data-model)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Automated Tests & Quality](#-automated-tests--quality)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## ✨ Core Features

- **🃏 Customizable Quizzes (Adaptive Anki-Style Mode):** Create and practice custom questions in agile blocks of 5 or 10 questions, incorporating contextual chips and sample sentences directly into the prompt.
- **🎯 Dynamic SRS Error-Funneling Algorithm:** Priority weighting computed using recency, error rate, difficulty, and review intervals, ensuring struggling items remain front and center.
- **🧠 Active Recall with Contextual Clues:**
  - *Collocations & Usage Contexts:* Displays natural pairings (e.g., `avoid people`, `avoid conflict`) to prime memory prior to card flip.
  - *Cloze Tests (Sentence Gap-Fills):* Blanks out target verbs (`[ _______ ]`) to challenge morphological conjugation and grammatical syntax.
- **🔊 Native English Speech Synthesis (TTS):** Automatic selection of native voices (`en-US` and `en-GB`), filtering incompatible accents, and providing instant auditory feedback.
- **📚 Complete Vocabulary Management (CRUD):** Add, update, and search vocabulary items (primary definition, CEFR level, difficulty, irregularity flags, inline sentence editing, and multiple meanings) with cascaded relational cleanup.
- **👥 Multi-Profile Student Isolation:** Switch between multiple student profiles seamlessly. Each student maintains a completely isolated catalog of words, review queues, study sessions, and metrics.
- **📊 Analytical Performance Dashboard:** Track retention rates, review accuracy, CEFR level mastery (A1 to C1), and error breakdowns by category (grammar, tense, meaning, etc.).

---

## 🏗 System Architecture & Logical Data Model

The application adheres to the structural principles defined in the core engineering specifications ([`modelo-logico-alvo.md`](file:///c:/Users/opera/Desktop/Training%20Verbs/skills/references/modelo-logico-alvo.md)):

### 1. The Database as the Ultimate Boundary (PostgreSQL 18)
Business logic and client validations are backed by hard constraints at the schema level:
- **Strict Data Ownership (Decision D-01):** Every vocabulary entry, review record, sentence, context, and study session is strictly associated with a `student_id`. There is no global shared catalog that can be inadvertently altered by another learner.
- **Composite Foreign Keys:** Child tables (`student_vocabulary`, `tense_practice`, `reviews`, `errors`, `sentences`, `contexts`, `paragraphs`) enforce compound foreign keys:
  ```sql
  FOREIGN KEY (vocabulary_item_id, student_id)
    REFERENCES vocabulary_items(id, student_id)
    ON DELETE CASCADE
  ```
  This guarantees at the database engine level that Student A's review logs or sentences can never reference or corrupt Student B's vocabulary.
- **Transactional Migrations:** Database versioning is governed by a pure Node.js migration runner (`server/src/db/migrations/`). Every migration script runs inside an atomic transaction (`BEGIN ... COMMIT`), tracking execution history in `schema_migrations`.

### 2. API Student Isolation Middleware (`requireStudent`)
- Every authenticated REST endpoint passes through the `requireStudent` middleware.
- The request must supply a valid `X-Student-Id` HTTP header. Missing headers return `400 Bad Request`; nonexistent student IDs return `404 Not Found`.
- All SQL queries filter exclusively by `req.studentId`. Attempts to specify `student_id` in the request body or query string are discarded.
- Accessing or modifying resources belonging to another profile always resolves to `404 Not Found` (preventing existence probing).

### 3. Client-Side Lifecycle & Interceptor
- The frontend (`client/src/api.js`) utilizes an Axios request interceptor that transparently injects `X-Student-Id` from the active profile stored in `localStorage`.
- When switching students, layout keys (`key={student.id}`) ensure React fully unmounts and remounts all screens, completely flushing memory caches, form states, and lingering view data.

### 4. Security Scope & Boundary Limitations
> [!NOTE]
> **Local / Personal Architecture:** The system is engineered for local, offline study and does not require third-party cloud services or centralized password authentication (no JWT/OAuth). While this architecture guarantees strict data segregation and prevents accidental cross-profile contamination, **it does not protect against users with physical access to the local machine or browser Developer Tools**, where headers can be freely spoofed. For hosted multi-user cloud deployments, a formal authentication layer must be placed in front of `requireStudent`.

---

## 🛠 Technology Stack

| Layer | Technology | Declared Version | Purpose |
|---|---|---|---|
| **Runtime & Language** | Node.js | `>= 18.0.0` | Server-side JavaScript execution environment |
| **Backend Framework** | Express | `^4.18.2` | RESTful API server, routing, and isolation middleware |
| **Database** | PostgreSQL | `>= 14.0.0` (18 recommended) | Relational database with composite constraints and transactional DDL |
| **Database Driver** | pg (node-postgres) | `^8.11.3` | Connection pooling and query execution |
| **Frontend Library** | React | `^19.2.8` | Component-based reactive user interface |
| **Frontend Tooling** | Vite | `^8.3.0` | Fast development server and production bundler |
| **Routing** | react-router-dom | `^7.18.4` | Client-side routing and layout management |
| **HTTP Client** | Axios | `^1.20.0` | API communication with `X-Student-Id` request interceptor |
| **Data Visualization** | Chart.js / react-chartjs-2 | `^4.5.1` / `^5.3.1` | Retention KPIs, weekly progress, and CEFR domain charts |
| **Backend Testing** | Jest / Supertest | `^29.7.0` / `^7.3.0` | Integration testing, isolation validation, and migration tests |
| **Frontend Testing** | Vitest / Testing Library | `^5.0.3` / `^16.3.3` | Unit tests for client isolation and SRS algorithms |
| **Code Quality** | Oxlint | `^1.81.0` | Static code analysis and linting |

---

## 📋 Prerequisites

Ensure your environment satisfies the following requirements:

- **Node.js:** Version 18 or higher (`node --version`)
- **npm:** Version 9 or higher (`npm --version`)
- **PostgreSQL:** Version 14 or higher (PostgreSQL 18 recommended) running on port `5432`

---

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mghkill/Study-Review-Blast.git
   cd Study-Review-Blast
   ```

2. **Install Backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install Frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root by copying the template [.env.example](./.env.example):

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `DB_HOST` | Yes | PostgreSQL host address | `localhost` |
| `DB_PORT` | Yes | PostgreSQL connection port | `5432` |
| `DB_NAME` | Yes | Database name | `reviewdatabase` |
| `DB_USER` | Yes | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | Yes | PostgreSQL password | `your_local_password` |
| `PORT` | No | Express server port (default: 3001) | `3001` |
| `NODE_ENV` | No | Environment mode (`development`/`production`) | `development` |

---

## 🏁 Running the Application

### 1. Database Migrations and Seed Data

Run the versioned migration runner and seed baseline data:

```bash
# Execute transactional migrations in server/src/db/migrations/
npm run migrate --prefix server

# Seed initial student profile and curated verb library
npm run seed --prefix server
```

### 2. Start Development Servers

Open two separate terminals:

- **Terminal 1 — Backend API (Port 3001):**
  ```bash
  cd server
  npm run dev
  ```
  *Health Check:* [http://localhost:3001/api/health](http://localhost:3001/api/health)

- **Terminal 2 — Frontend Application (Port 5173):**
  ```bash
  cd client
  npm run dev
  ```
  *Access Web UI:* [http://localhost:5173/](http://localhost:5173/)

---

## 🌐 API Endpoints

All endpoints except `/api/health` and `/api/students` require the `X-Student-Id` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and database connectivity check |
| `GET`, `POST` | `/api/students` | List student profiles and create new empty profile |
| `GET`, `PATCH`, `DELETE` | `/api/students/:id` | Fetch, update, or delete student with cascaded cleanup |
| `GET`, `POST` | `/api/vocabulary` | Query or create vocabulary items for active student |
| `GET`, `PATCH`, `DELETE` | `/api/vocabulary/:id` | Fetch details, edit fields, or remove word |
| `GET` | `/api/reviews/queue` | Retrieve intelligent SRS study queue for active student |
| `POST` | `/api/reviews` | Submit card review (recalculates intervals and mastery) |
| `GET` | `/api/reviews/errors` | Retrieve error analytics grouped by grammatical category |
| `POST` | `/api/sessions` | Create new study session (`mixed`, `weak`, `review`, etc.) |
| `PATCH` | `/api/sessions/:id` | Finalize session and record performance metrics |
| `GET` | `/api/dashboard` | Aggregated KPIs, retention metrics, and CEFR breakdown |
| `GET`, `POST` | `/api/sentences` | Query or add custom sentences linked to vocabulary |
| `GET`, `POST` | `/api/sentences/paragraphs`| Manage multi-sentence contextual paragraphs |

---

## 📁 Project Structure

```text
Study-Review-Blast/
├── client/                      # React SPA Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components (Sidebar, TTSButton, Badges)
│   │   ├── context/             # Global AppContext (active student sync & state reset)
│   │   ├── pages/               # Views (Dashboard, StudySession, VocabDetail, etc.)
│   │   ├── test/                # Vitest test suites (isolation & SRS)
│   │   ├── api.js               # Axios client with X-Student-Id request interceptor
│   │   └── index.css            # Dark theme, glassmorphic styling system
│   ├── package.json
│   └── vite.config.js
├── server/                      # Node.js Express REST API
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrations/      # Transactional migration scripts (001_..., 002_...)
│   │   │   ├── migrate.js       # Transactional migration runner
│   │   │   ├── connection.js    # PostgreSQL pg pool connection
│   │   │   └── seed.js          # Database seeder
│   │   ├── middleware/          # requireStudent isolation middleware
│   │   ├── routes/              # Express routers (students, vocabulary, reviews, etc.)
│   │   ├── services/            # SRS scheduling & algorithm services
│   │   └── index.js             # Express application entrypoint
│   ├── tests/                   # Jest / Supertest integration test suite
│   └── package.json
├── docs/                        # Architecture and security specifications
├── plano-de-acao/               # Project management, task tracking, and master guide
└── README.md                    # Main project documentation
```

---

## 🧪 Automated Tests & Quality

Run the automated validation suites:

- **Backend Integration & Isolation Tests (Jest):**
  ```bash
  cd server
  npm test
  ```
  *Validates endpoint behavior, composite foreign key isolation, and migration rollbacks (46 passing tests).*

- **Frontend Isolation & Unit Tests (Vitest):**
  ```bash
  cd client
  npm run test:run
  ```

- **Static Code Analysis (Oxlint):**
  ```bash
  cd client
  npm run lint
  ```

---

## 🗺️ Roadmap

- [x] Complete vocabulary CRUD with inline editing and cascaded cleanup.
- [x] Active Recall hints (collocations and contextual cloze tests).
- [x] Dynamic custom quizzes organized in 5- and 10-question blocks.
- [x] Multi-student relational isolation with composite foreign keys.
- [ ] Dedicated `tenses` relational table with standardized grammatical tense codes.
- [ ] Offline sentence generator using regular/irregular verbal morphology.
- [ ] Export and import decks in CSV and JSON formats.
- [ ] Dedicated listening practice module with speech transcription.

---

## 📄 License

This project is licensed under the terms of the **MIT** License. See the [LICENSE](./LICENSE) file for details.
