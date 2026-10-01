# How to Resume Work (Quick Guide & Developer Rules)

> **Important for Newcomers:** Read this file and check current status first.

---

## 1. Quick Start Workflow

1. Run `py plano-de-acao/plan_tool.py status` (use `python` if `py` is not mapped).
2. Read **only** the "NEXT STEP" block in `plano-de-acao/PLANO.md` and the last 15 lines of `plano-de-acao/LINHA-DO-TEMPO.md`.
3. Run `git status --short` and `git log -3 --oneline` to verify if the previous task was genuinely finished and committed. If a task is marked `[~]` (in progress), verify and finish it before moving forward.
4. Continue with the `[~]` task or the first `[ ]` pending task. **Never replan or redo what is already marked `[x]`.**

---

## 2. Execution Hierarchy (Where to Find the Source of Truth)

- **`plano-de-acao/PROMPT_ORIGINAL.md` is our MASTER GUIDE:**
  It defines the project foundation, architectural decisions (D-01 to D-04), requirements, and pedagogical goals. Whenever there is a design question, this master file takes precedence.
- **`plano-de-acao/PLANO.md` is our GPS:**
  It tracks real-time progress and lists pending tasks across all phases. It must be updated immediately before starting (`start`) and after completing (`done`) each task.
- **`skills/references/modelo-logico-alvo.md` is our ARCHITECTURAL BLUEPRINT:**
  It details data ownership, composite foreign keys, isolation middleware, PostgreSQL 18 standards, and the offline sentence generator.
- **`plano-de-acao/plan_tool.py` is the operational tool:**
  Use it to change task states (`start`, `done`, `log`, `status`). Do not rely on it as project documentation.

---

## 3. Strict Development Rules

1. **One Task at a Time:**
   - Follow the strict cycle: `start` → implement → verify with concrete tests → `done --nota "..."`.
   - **Never mark a task as completed without verified evidence.**
   - Log decisions and error investigations with `py plano-de-acao/plan_tool.py log "message"`.
2. **Local Git Commits (English Only):**
   - **From now on, all git commit messages must be written in English** using conventional prefixes: `feat:`, `fix:`, `docs:`, or `chore:`.
   - Always run `git add .` from the **project root** before committing, ensuring no nested files or plan updates are left behind.
   - Do not run `git push` unless explicitly asked.
3. **Phase Checkpoint Rule:**
   - **Stop at the end of each phase** and wait for the user to explicitly write `"continue"` (or `"continuar"`) before starting the next phase.
4. **Immutable Stack:**
   - Do **not** replace or alter PostgreSQL 18, Express, React, or Vite.
   - Keep dev scripts (`npm run dev`) and default ports unchanged: **3001** (Backend API) and **5173** (Frontend Client).
   - Do **not** install new dependencies without prior user approval.
5. **Credentials and Security:**
   - Read database credentials strictly from root `.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `DB_PASSWORD`).
   - `DB_PASSWORD` must be used strictly via environment variables or session scopes (`PGPASSWORD`).
   - **Never echo, print, or commit passwords or secret tokens into logs, plans, transcripts, or commit messages.**
6. **Token Economy:**
   - Keep responses concise: maximum of 4 lines of summary per completed task.
   - Do not re-read entire files unnecessarily; use targeted searches and line-range views.
   - Keep command outputs limited and run test suites in summary/quiet mode when possible.