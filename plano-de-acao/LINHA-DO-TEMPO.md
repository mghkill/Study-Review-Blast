# Linha do tempo

Registro cronológico (mais antigo primeiro). Só se acrescenta; nunca se apaga.

- **2026-09-30 23:50** — Plano criado a partir do plano inicial da skill studyreviewblast-planner.
- **2026-09-30 23:50** — [T-001] iniciada.
- **2026-09-30 23:53** — T-001 reconhecimento: NÃO existe package.json na raiz (só em server/ e client/). server: Express 4.18.2, pg 8.11.3, Jest 29, Supertest 7.3. client: React 19.2.8, Vite 8.3, Vitest 5, Oxlint 1.81, axios 1.20, chart.js 4.5.1, react-router-dom 7.18.4. Schema tem 16 tabelas (README diz 14). README diz PostgreSQL >=14 mas schema diz 18. README aponta LICENSE e CONTRIBUTING.md que NÃO existem. session_type CHECK no schema aceita mixed/new_acquisition/review/pronunciation/weak_items/specific_verb; falta custom_quiz/consolidation/maintenance/free_practice. Migrate atual é simples: roda schema.sql inteiro com IF NOT EXISTS. Seed cria estudante Filipe e vincula todos os vocabs. .env no .gitignore OK. server/.env existe (segundo ao .env da raiz com override). Comando py funciona.
- **2026-09-30 23:53** — [T-001] concluída. Lidos todos os package.json, .env.example, schema.sql (16 tabelas), 6 rotas, srs.js, migrate.js, seed.js, connection.js e README. Divergências: README diz PG>=14 (é 18), 14 tabelas (são 16), session_type incompleto, LICENSE/CONTRIBUTING inexistentes, sentences é global. .env no .gitignore OK.
- **2026-09-30 23:53** — [T-002] iniciada.
- **2026-09-30 23:54** — [T-002] concluída. Estudante ativo: localStorage via AppContext (selectStudent guarda em currentStudent). O student.id é passado como query param (studentId) ou no body de cada request. NÃO há header X-Student-Id, NÃO há middleware no server. Cada página lê useApp().student e envia explicitamente. Algumas rotas (sentences, vocabulary listing) incluem 'OR student_id IS NULL', confirmando o vazamento global. POST /vocabulary associa a TODOS os estudantes. POST /students vincula todos os vocab.
- **2026-09-30 23:54** — [T-003] iniciada.
- **2026-09-30 23:57** — [T-003] concluída. npm run dev funciona nos dois: server (nodemon, porta 3001), client (vite, porta 5173). Health check OK: status=ok, db=connected.
- **2026-09-30 23:58** — [T-004] iniciada.
- **2026-10-01 00:01** — [T-004] concluída. Branch fix/isolamento-e-evolucao criada a partir de main (commit 554f9c6). Árvore limpa.
- **2026-10-01 02:24** — [T-005] iniciada.
- **2026-10-01 02:31** — [T-005] concluída. Backup pg_dump -Fc gerado em C:\Users\opera\studyreviewblast-backups\studyreviewblast_backup_20261001_023059.dump (66526 bytes)
- **2026-10-01 02:32** — T-005: Backup do banco com pg_dump -Fc gerado com sucesso em C:\Users\opera\studyreviewblast-backups\studyreviewblast_backup_20261001_023059.dump (66526 bytes). Sem expor credenciais.
