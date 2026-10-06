# Cartões das tarefas — Plano V2

> Cada cartão diz **o que fazer** numa sessão. A IA lê **só o cartão da tarefa do dia** (busque por `### T-0XX`), mais os arquivos indicados em **Ler**.
> O estado (`[ ]`, `[~]`, `[x]`) vive em [`PLANO.md`](./PLANO.md). O ritual de abertura e a **pausa obrigatória** estão em [`RETOMAR.md`](./RETOMAR.md).
> Prompt de todas as tarefas: `Leia plano-de-acao/RETOMAR.md e execute a T-0XX.` (troque o número).
> Abreviações dos arquivos em **Ler**: `ENG` = `skills/SKILLENG.md` · `CONV` = `skills/references/convencoes-v2.md` · `MLA` = `skills/references/modelo-logico-alvo.md` · `DIAG` = `skills/references/diagnostico-atual.md` · `README-SKILL` = `skills/skill.md` · `OSB` = `skills/references/open-source-basico.md` · `OSC` = `skills/references/open-source-checklist.md`.
> "Teste antes" = o teste (ou verificação automatizada, quando não há código) é escrito **primeiro**, rodado e visto **falhando**; só depois se implementa.

---

## Fase 1 — Reconhecimento e rede de segurança
Branch da fase: `v2/phase-01-safety-net`

### T-001 · Abrir o V2 (branch da fase 1)
**P · Origem:** novo (refaz v1 T-004) · **Ler:** ENG
- **Objetivo:** começar o V2 a partir de um ponto limpo e rastreável.
- **Back:** confirmar `git status --short` vazio em `main`, `git pull` feito por você se houver remoto à frente; criar `v2/phase-01-safety-net`; registrar com `log` o hash base.
- **Front:** sem impacto (só git).
- **Teste antes:** `git rev-parse --abbrev-ref HEAD` deve devolver `main` (prova que a branch ainda não existe).
- **Pronto quando:** branch criada, árvore limpa, hash base na linha do tempo.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** nenhum código; o commit da pausa leva só o plano (`chore(plan): start v2 phase 1 (T-001)`).
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-001.`

### T-002 · Backup novo e teste de restauração
**P · Origem:** refaz v1 T-005 · **Ler:** ENG, MLA §9
- **Objetivo:** ter um backup recente e **comprovadamente restaurável** antes de qualquer mudança do V2.
- **Back:** `pg_dump -Fc` para diretório de backup externo ao repositório (ex.: `../studyreviewblast-backups/` ou `$env:SRB_BACKUP_DIR`); restaurar num banco temporário `srb_restore_check`; comparar contagem de linhas por tabela com o original; apagar o banco temporário. Senha só em `$env:PGPASSWORD` da sessão.
- **Front:** sem impacto (operação de banco).
- **Teste antes:** script PowerShell de conferência que compara contagens entre os dois bancos; rodado antes da restauração, falha (banco de cópia não existe).
- **Pronto quando:** contagens idênticas; só o caminho do arquivo registrado (nunca senha).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore(db): record v2 baseline backup (T-002)` (só plano).
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-002.`

### T-003 · Baseline de qualidade
**P · Origem:** refaz v1 T-003 e T-006 · **Ler:** ENG
- **Objetivo:** saber exatamente de onde partimos (para provar que nada piorou).
- **Back:** rodar `npm test` (server), `npm run test:run` e `npm run lint` (client), `npm audit --omit=dev` nas duas pastas; subir `npm run dev` nas duas e checar `http://localhost:3001/api/health`.
- **Front:** abrir cada tela (Dashboard, Estudar Agora, Vocabulário, Detalhes, Novo Verbo, Frases, Parágrafos, Busca, Progresso) e anotar o que abre, quebra ou fica vazio.
- **Teste antes:** não se aplica (é medição); a "verificação" é a lista de comandos acima com resultados registrados.
- **Pronto quando:** números (passaram/falharam/avisos/vulnerabilidades) e o smoke das telas registrados com `log`.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore(plan): record v2 quality baseline (T-003)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-003.`

### T-004 · Matriz de usabilidade
**M · Origem:** v1 T-060 (antecipada) · **Ler:** ENG (nota: `DIAG` e `MLA` são históricos; gerar a matriz exclusivamente a partir do código real)
- **Objetivo:** mapear a partir do **código real** e das **tabelas atuais do banco** o que existe na API e no schema mas **não aparece ou não serve** na interface (ex.: quiz personalizado não é salvo; `custom_quizzes` sem rota; frases e parágrafos não entram no estudo; `pronunciation_practice`, `context_mastery`, `student_sentences` sem tela). **Não usar `diagnostico-atual.md` como verdade.**
- **Back:** inspecionar as rotas reais (`server/src/routes/`), controllers, migrações 001–009 e tabelas reais do banco (`\dt`); para cada tabela: rota que lê/escreve, tela que mostra, teste que cobre.
- **Front:** inspecionar as telas reais (`client/src/pages/` e componentes): cada tela recebe ✅ funciona / ⚠️ parcial / ❌ ausente, com a tarefa V2 que resolve.
- **Teste antes:** não se aplica (documento); verificação: toda tabela do schema real aparece na matriz (conferir com `\dt` no banco).
- **Pronto quando:** `docs/usability-matrix.md` criado (em inglês), gerado pelo código e schema reais, com cada ❌ apontando para uma T do V2 ou para o roadmap.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: add usability matrix (T-004)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-004.`

---

## Fase 2 — Qualidade e ferramentas base
Branch da fase: `v2/phase-02-quality-tooling`

### T-005 · package.json na raiz (ferramentas)
**P · Origem:** novo (D-09) · **Ler:** ENG, CONV §1
- **Objetivo:** um lugar na raiz para ferramentas que valem para o repositório todo (hooks precisam estar onde está o `.git`).
- **Back:** `package.json` privado na raiz, sem dependências de runtime; scripts `test` (`npm --prefix server test && npm --prefix client run test:run`) e `lint`. Não tocar nos scripts de `server/` e `client/`.
- **Front:** sem impacto (só scripts).
- **Teste antes:** `npm test` na raiz falha (não existe `package.json`).
- **Pronto quando:** `npm test` e `npm run lint` na raiz rodam as duas pastas e passam como no baseline.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build: add root package.json for repo-wide tooling (T-005)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-005.`

### T-006 · ESLint no server
**M · Origem:** novo · **Ler:** ENG, CONV §1
- **Objetivo:** lint no backend (hoje não existe).
- **Back:** `eslint.config.js` (flat config, `@eslint/js` recommended, `globals.node` e `globals.jest`); script `lint` em `server/`; corrigir só **erros**; avisos registrados como baseline. Client mantém Oxlint (D-17).
- **Front:** sem impacto (client já tem Oxlint).
- **Teste antes:** `npm run lint --prefix server` falha (script inexistente).
- **Pronto quando:** lint do server com 0 erros; `npm run lint` da raiz roda server + client.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build(server): add eslint flat config (T-006)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-006.`

### T-007 · Prettier e formatação geral
**M · Origem:** novo · **Ler:** ENG, CONV §1
- **Objetivo:** estilo de código único e automático.
- **Back:** `.prettierrc` e `.prettierignore` na raiz; scripts `format` e `format:check`; aplicar a formatação em **um commit só de formatação** e registrar o hash em `.git-blame-ignore-revs`.
- **Front:** arquivos do client só reformatados; conferir `npm run build --prefix client` e abrir 2 telas: sem mudança visual.
- **Teste antes:** `npm run format:check` falha (script inexistente; depois, falha por arquivos fora do padrão).
- **Pronto quando:** `format:check` passa; testes iguais ao baseline.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** dois commits: `style: apply prettier to whole repo (T-007)` e `chore: add .git-blame-ignore-revs (T-007)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-007.`

### T-008 · Husky, lint-staged e guarda contra commit parcial
**M · Origem:** novo (motivado pelo commit parcial que já aconteceu) · **Ler:** ENG, CONV §1
- **Objetivo:** impedir commit com arquivos esquecidos e código fora do padrão.
- **Back:** Husky na raiz; `pre-commit` roda (1) `scripts/guard-partial-commit.mjs`, que **bloqueia** se houver mudanças não adicionadas ou arquivos não rastreados (contorno consciente: `SRB_ALLOW_PARTIAL=1`), e (2) `lint-staged` (Prettier + ESLint/Oxlint nos arquivos staged).
- **Front:** sem impacto (fluxo de git).
- **Teste antes:** teste do script (`node --test`) simulando um repositório temporário com arquivo não adicionado: espera código de saída ≠ 0. Falha antes (script inexistente).
- **Pronto quando:** tentar commitar com um arquivo de fora bloqueia com mensagem clara; com `git add .` na raiz passa.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build: add husky, lint-staged and partial-commit guard (T-008)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-008.`

### T-009 · commitlint
**P · Origem:** novo · **Ler:** ENG, CONV §1
- **Objetivo:** mensagens no padrão Conventional Commits garantidas por máquina.
- **Back:** `commitlint.config.js` com `@commitlint/config-conventional`; hook `commit-msg`.
- **Front:** sem impacto.
- **Teste antes:** `echo "bad message" | npx commitlint` deve falhar e `echo "feat: ok" | npx commitlint` passar; antes da instalação o comando não existe.
- **Pronto quando:** commit com mensagem fora do padrão é recusado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build: enforce conventional commits with commitlint (T-009)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-009.`

### T-010 · GitHub Actions (CI)
**M · Origem:** novo (absorve v1 T-073) · **Ler:** ENG, CONV §1
- **Objetivo:** todo push e PR roda lint e testes automaticamente; selo de CI verdadeiro no README.
- **Back:** `.github/workflows/ci.yml`: Node 24; job server com serviço `postgres:18` (migrate + test); job client (lint, test:run, build). Variáveis de banco do CI são fictícias e locais ao job (nunca segredos reais).
- **Front:** o job do client roda `build` (garante que a interface compila).
- **Teste antes:** não há como rodar Actions localmente; verificação: validar YAML com `npx --yes yaml-lint`-equivalente **sem instalar** (ou revisão manual) e, após seu push, o run deve aparecer vermelho/verde.
- **Pronto quando:** você fez push e o workflow ficou verde (se ficar vermelho, a próxima sessão corrige antes de seguir).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `ci: add lint and test workflow (T-010)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-010.`

### T-011 · Dependabot e CodeQL
**P · Origem:** novo · **Ler:** ENG, CONV §1
- **Objetivo:** atualizações de dependências e análise de segurança automáticas (gratuitas em repositório público).
- **Back:** `.github/dependabot.yml` (npm em `/`, `/server`, `/client`; `github-actions`; semanal; grupos minor/patch); `.github/workflows/codeql.yml` (javascript).
- **Front:** sem impacto.
- **Teste antes:** verificação: os arquivos não existem (`Test-Path` falso).
- **Pronto quando:** após o push, a aba Security/Insights mostra Dependabot e CodeQL ativos.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `ci: add dependabot and codeql (T-011)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-011.`

---

## Fase 3 — Ambiente reproduzível
Branch da fase: `v2/phase-03-environment`

### T-012 · Banco de testes separado
**M · Origem:** novo (D-12) · **Ler:** ENG, CONV §2
- **Objetivo:** os testes hoje gravam no banco de desenvolvimento (e existe um `clean_test_db.js` para limpar). Isso acaba.
- **Back:** `tests/jest.setup.js` usa `DB_NAME_TEST` (padrão `<DB_NAME>_test`), cria o banco se faltar, roda as migrações e limpa entre suítes; remover `server/clean_test_db.js`; CI usa o mesmo mecanismo.
- **Front:** sem impacto (infra de testes).
- **Teste antes:** teste que verifica `current_database()` durante a suíte termina em `_test`; falha hoje.
- **Pronto quando:** suíte inteira verde no banco de teste; contagens do banco de desenvolvimento idênticas antes/depois da suíte.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(server): run tests against a dedicated database (T-012)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-012.`

### T-013 · Validação do .env e banner de servidor indisponível
**M · Origem:** novo · **Ler:** ENG, CONV §2
- **Objetivo:** erro claro quando falta configuração; um único `.env` (hoje há raiz + `server/.env` com override).
- **Back:** `server/src/config/env.js` com Zod (lista o **nome** das variáveis faltando, nunca valores); `connection.js` e `index.js` usam esse módulo; `server/.env` deixa de ser lido (aviso no boot se existir); `.env.example` completo.
- **Front:** componente `ServerStatusBanner` que consulta `/api/health` e mostra "Servidor indisponível — rode `npm run dev` no server" quando falha.
- **Teste antes:** Jest: `loadEnv({})` lança erro citando `DB_HOST`; Vitest: banner aparece com health mockado em erro. Ambos falham antes.
- **Pronto quando:** testes verdes; app sobe com o `.env` da raiz.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(server): validate environment with zod; feat(client): server status banner (T-013)` (use `feat:` e cite os dois no corpo).
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-013.`

### T-014 · Docker Compose só para o PostgreSQL
**P · Origem:** novo (D-11) · **Ler:** ENG, CONV §2
- **Objetivo:** qualquer pessoa sobe o banco certo (PostgreSQL 18) com um comando.
- **Back:** `docker-compose.yml` com `postgres:18`, volume nomeado, healthcheck, porta do host `${DB_PORT_DOCKER:-5433}` (evita conflito com o PostgreSQL local); scripts `db:up` e `db:down` na raiz. Se D-11 = não instalar, criar o arquivo e marcar a verificação como pendente com `log`.
- **Front:** sem impacto.
- **Teste antes:** `docker compose config` falha (arquivo inexistente).
- **Pronto quando:** `docker compose config` válido; `npm run db:up` + `npm run migrate --prefix server` apontando para a porta do contêiner funciona.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build: add docker compose for postgres 18 (T-014)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-014.`

### T-015 · `npm run dev` único e `npm run setup`
**P · Origem:** novo (D-09) · **Ler:** ENG, CONV §2
- **Objetivo:** um comando sobe tudo; os comandos antigos continuam.
- **Back:** na raiz, `dev` = `concurrently -n server,client "npm --prefix server run dev" "npm --prefix client run dev"`; `setup` = instalar server e client (`npm ci`).
- **Front:** client sobe na 5173 pelo comando da raiz.
- **Teste antes:** script `scripts/check-dev-ports.mjs` que espera 3001 e 5173 responderem; falha antes (script `dev` na raiz inexistente).
- **Pronto quando:** `npm run dev` na raiz sobe os dois; `npm run dev` em cada pasta continua igual.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build: add root dev and setup scripts (T-015)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-015.`

---

## Fase 4 — Migrações versionadas e modelo lógico (SQL)
Branch da fase: `v2/phase-04-migrations`
> Justificativa da ordem: o restante do modelo lógico (v1 T-044 a T-048) é feito **antes** do ORM para que a introspecção leia o schema final e não precise ser refeita.

### T-016 · (concluída no legado) Migrações versionadas
Concluída no v1 (T-010 a T-013): `server/src/db/migrator.js`, `schema_migrations`, `001_baseline.sql`, migrations 002–005, testes em `migrator.test.js`. Nada a executar.

### T-017 · (concluída no legado) Modelo lógico parte 1
Concluída no v1 (T-040 a T-043): migrations 006–009 (`tenses`, CHECKs de `session_type`/`source`, `custom_quizzes`, `language_code`). Nada a executar.

### T-018 · Migrador com checksum e status
**M · Origem:** novo · **Ler:** ENG, MLA §5
- **Objetivo:** impedir que alguém edite uma migração já aplicada sem perceber; ver o estado das migrações.
- **Back:** coluna `checksum` em `schema_migrations` (criada pelo próprio migrador de forma idempotente; preencher as já aplicadas na primeira execução); `migrate` recusa arquivo cujo hash mudou; `npm run migrate:status` lista aplicadas e pendentes; `/api/health` devolve `schemaVersion`.
- **Front:** rodapé da Sidebar mostra `DB v009` (versão vinda do health).
- **Teste antes:** `migrator.test.js`: alterar o conteúdo de uma migração aplicada → `runMigrations` rejeita; Vitest: Sidebar renderiza a versão mockada. Falham antes.
- **Pronto quando:** testes verdes; `migrate:status` funciona no banco de desenvolvimento.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(db): checksum applied migrations and add migrate:status (T-018)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-018.`

### T-019 · Limpeza de scripts soltos e do schema duplicado
**P · Origem:** novo · **Ler:** ENG, MLA §5
- **Objetivo:** um só caminho para mudar o banco.
- **Back:** conferir que a constraint criada por `migrate_session_type.js` (raiz) é coberta pela migration 007 e removê-lo; trocar `server/src/db/schema.sql` (cópia antiga da 001) por `schema.snapshot.sql` gerado por `npm run db:snapshot` (`pg_dump --schema-only`).
- **Front:** sem impacto.
- **Teste antes:** verificação: `Test-Path migrate_session_type.js` verdadeiro e `db:snapshot` inexistente.
- **Pronto quando:** arquivos removidos/substituídos; nenhum `require` aponta para eles (`git grep`).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore(db): remove ad-hoc migration script and generate schema snapshot (T-019)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-019.`

### T-020 · `updated_at` automático
**P · Origem:** v1 T-044 · **Ler:** ENG, MLA §6
- **Objetivo:** `updated_at` hoje só recebe valor na criação.
- **Back:** migration `010_set_updated_at.sql`: função `set_updated_at()` e gatilho `BEFORE UPDATE` em toda tabela com `updated_at`.
- **Front:** Detalhes da Palavra mostra "Atualizado em dd/mm/aaaa hh:mm".
- **Teste antes:** Jest: atualizar uma palavra muda `updated_at`; Vitest: VocabDetail exibe a data. Falham antes.
- **Pronto quando:** testes verdes; migração aplicada no banco de desenvolvimento (após backup da T-002).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(db): auto-update updated_at via trigger (T-020)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-020.`

### T-021 · Índices
**P · Origem:** v1 T-045 · **Ler:** ENG, MLA §6
- **Objetivo:** chaves estrangeiras sem índice e consultas quentes (fila, atividade por data).
- **Back:** migration `011_indexes.sql` com índices nas FKs usadas em junções e compostos `student_vocabulary (student_id, review_priority DESC)`, `reviews (student_id, reviewed_at)`.
- **Front:** sem impacto visual (desempenho); conferir que Dashboard e fila abrem normalmente.
- **Teste antes:** Jest consulta `pg_indexes` esperando os nomes novos; falha antes.
- **Pronto quando:** teste verde; `EXPLAIN` da fila usa o índice (registrar com `log`).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `perf(db): add foreign key and hot-path indexes (T-021)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-021.`

### T-022 · `ON DELETE` e excluir contexto
**M · Origem:** v1 T-046 · **Ler:** ENG, MLA §2
- **Objetivo:** hoje excluir um contexto já praticado falha (`reviews.context_practiced` sem regra).
- **Back:** migration `012_on_delete_rules.sql` (`context_practiced` → `ON DELETE SET NULL`; revisar cascatas de palavra e de estudante); rota `DELETE /api/vocabulary/:id/contexts/:contextId` com escopo do estudante (404 para alheio).
- **Front:** botão "Excluir contexto" com confirmação em Detalhes da Palavra.
- **Teste antes:** Jest: excluir contexto com revisão responde 200 e a revisão fica com `context_practiced = NULL`; estudante B recebe 404; Vitest: botão chama a API. Falham antes.
- **Pronto quando:** testes verdes, isolamento verde.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: delete usage contexts safely (T-022)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-022.`

### T-023 · Documento do modelo de dados
**P · Origem:** v1 T-047 · **Ler:** ENG, MLA §1–2
- **Objetivo:** quem chega entende o banco em 5 minutos.
- **Back:** `docs/data-model.md` (inglês): diagrama Mermaid `erDiagram` de todas as tabelas, dicionário (coluna, tipo, regra), explicação das chaves compostas.
- **Front:** sem impacto (documentação).
- **Teste antes:** verificação: script lista as tabelas de `\dt` e confere que cada uma aparece no documento; falha antes (arquivo inexistente).
- **Pronto quando:** todas as tabelas documentadas; Mermaid renderiza no GitHub.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: add data model with mermaid erd (T-023)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-023.`

### T-024 · Prova das migrações
**P · Origem:** v1 T-048 · **Ler:** ENG, MLA §5 e §9
- **Objetivo:** provar que as migrações criam o mesmo banco do zero e a partir do backup.
- **Back:** aplicar tudo num banco vazio e numa restauração do backup da T-002; gerar `schema.snapshot.sql` dos dois e comparar.
- **Front:** sem impacto.
- **Teste antes:** script de comparação dos snapshots (falha se diferentes); rodado antes de aplicar, falha (banco vazio não tem tabelas).
- **Pronto quando:** snapshots idênticos; resultado registrado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(db): verify migrations on empty and restored databases (T-024)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-024.`

---

## Fase 5 — ORM (D-05, D-06)
Branch da fase: `v2/phase-05-orm`
> Regra da fase: o **contrato da API não muda**. Os testes de API e de isolamento existentes são a rede de segurança: devem continuar verdes a cada tarefa. Por isso o front de cada tarefa é "sem mudança visual" + conferência das telas afetadas.

### T-025 · Decisão registrada, instalação e introspecção
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** colocar o ORM no projeto sem trocar nenhuma consulta ainda.
- **Back:** `docs/adr/0001-orm.md` (contexto, opções, decisão D-05/D-06); instalar o ORM; introspecção (`drizzle-kit pull` ou `prisma db pull`) gerando o schema em `server/src/db/orm/`; cliente do ORM reaproveitando o `Pool` do `pg`.
- **Front:** sem impacto (nenhuma rota alterada).
- **Teste antes:** Jest: `orm.select().from(students)` (ou `prisma.students.count()`) devolve número; falha antes (módulo inexistente).
- **Pronto quando:** teste verde; suíte antiga verde.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(server): add drizzle orm with introspected schema (T-025)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-025.`

### T-026 · Verificação de drift
**P · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** garantir que o schema do ORM nunca fique diferente do banco criado pelas migrações.
- **Back:** `npm run db:check-drift` (re-introspecta num diretório temporário e compara); passo no CI após `migrate`.
- **Front:** sem impacto.
- **Teste antes:** criar uma migração de teste local que adiciona coluna → `db:check-drift` deve falhar; antes da tarefa o script não existe.
- **Pronto quando:** sem drift → passa; com drift → falha com mensagem clara.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `ci: check orm schema drift (T-026)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-026.`

### T-027 · Repositórios + `students` e `tenses`
**M · Origem:** novo · **Ler:** ENG, CONV §3, MLA §2
- **Objetivo:** criar o padrão que todas as rotas vão seguir.
- **Back:** `server/src/repositories/` com funções que recebem `studentId` obrigatório (ex.: `vocabularyRepo.forStudent(id)`); migrar `routes/students.js` e `routes/tenses.js`.
- **Front:** sem mudança visual; conferir tela de seleção de estudante e seletores de tempo verbal.
- **Teste antes:** testes unitários dos repositórios (ex.: `listStudents`, `listTenses`) falham antes (módulos inexistentes).
- **Pronto quando:** testes novos e antigos verdes; nenhuma `db.query` nas duas rotas.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): introduce repositories; migrate students and tenses (T-027)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-027.`

### T-028 · `sessions`
**P · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar operações de sessões de estudo para repositório ORM, eliminando SQL manual.
- **Back:** `sessionsRepo` e `routes/sessions.js` sem SQL manual.
- **Front:** sem mudança visual; iniciar e encerrar uma sessão em "Estudar Agora".
- **Teste antes:** unitário de `sessionsRepo.finish()` só atualiza sessão do próprio estudante; falha antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate sessions to orm (T-028)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-028.`

### T-029 · `dashboard`
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar agregações do dashboard para o builder/template do ORM mantendo exatidão dos números e segurança.
- **Back:** agregações com o builder do ORM ou com o template `sql` **parametrizado** (nunca concatenação).
- **Front:** sem mudança visual; comparar os números do Dashboard antes/depois (print ou anotação).
- **Teste antes:** teste de contrato: resposta de `/api/dashboard` para um estudante com dados conhecidos tem os mesmos campos e valores; escrever com o código atual (passa) e rodar após a troca. Teste novo de repositório falha antes.
- **Pronto quando:** números idênticos; testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate dashboard to orm (T-029)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-029.`

### T-030 · `sentences` e `paragraphs`
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar rotas de frases e parágrafos para repositórios ORM com escopo estrito de estudante.
- **Back:** `sentencesRepo`, `paragraphsRepo`; rotas sem SQL manual.
- **Front:** sem mudança visual; conferir Banco de Frases e Parágrafos.
- **Teste antes:** unitários dos dois repositórios (incluindo escopo por estudante) falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate sentences and paragraphs to orm (T-030)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-030.`

### T-031 · `vocabulary` — leitura
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar leituras de vocabulário (busca, filtros e detalhes relacionais) para repositório ORM.
- **Back:** lista (busca, filtros) e detalhe (significados, formas verbais, contextos, frases, domínio por tempo) via repositório.
- **Front:** sem mudança visual; conferir Vocabulário (filtros) e Detalhes.
- **Teste antes:** unitários de `vocabularyRepo.list/get` com filtros; falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate vocabulary reads to orm (T-031)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-031.`

### T-032 · `vocabulary` — escrita
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar mutações transacionais de vocabulário (criação, edição e exclusão) para repositório ORM.
- **Back:** criar (palavra + formas + significados + contextos numa transação), editar, excluir, frases, contextos e significados.
- **Front:** sem mudança visual; criar um verbo em Novo Verbo, editar e excluir.
- **Teste antes:** unitário: falha no meio da criação desfaz tudo (transação); falha antes.
- **Pronto quando:** testes verdes; `routes/vocabulary.js` sem SQL manual.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate vocabulary writes to orm (T-032)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-032.`

### T-033 · `reviews` — fila
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar consulta da fila de revisões para repositório ORM preservando o algoritmo SRS e escopo.
- **Back:** consulta da fila (filtros por modo e CEFR, amostras de frases do próprio estudante) via repositório; `srs.js` intacto.
- **Front:** sem mudança visual; abrir cada modo de "Estudar Agora".
- **Teste antes:** unitário de `reviewsRepo.queue` por modo; falha antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate review queue to orm (T-033)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-033.`

### T-034 · `reviews` — escrita e históricos
**M · Origem:** novo · **Ler:** ENG, CONV §3
- **Objetivo:** migrar registro de revisões e histórico com integridade transacional para repositório ORM.
- **Back:** registrar revisão (atualiza `student_vocabulary`, `tense_practice`, `errors` em transação), histórico, estatísticas de erro, frase do aluno.
- **Front:** sem mudança visual; responder um cartão e conferir Progresso.
- **Teste antes:** unitário: revisão grava tudo ou nada; falha antes.
- **Pronto quando:** testes verdes; `routes/reviews.js` sem SQL manual.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): migrate review writes to orm (T-034)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-034.`

### T-035 · Seed e regra anti-SQL-concatenado
**P · Origem:** novo · **Ler:** ENG, CONV §3 e §5
- **Objetivo:** migrar seed para ORM e garantir por lint a proibição definitiva de SQL concatenado.
- **Back:** `seed.js` com o ORM; regra ESLint (`no-restricted-syntax`) que proíbe template string com `${}` dentro de chamadas `query(`/`sql.raw(`; `db.query` permitido só em `migrator.js`.
- **Front:** sem impacto.
- **Teste antes:** arquivo de fixture com SQL concatenado deve gerar erro de lint (teste com `ESLint` API); falha antes.
- **Pronto quando:** lint verde no projeto e vermelho na fixture; `seed` funciona no banco de teste.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): seed via orm and forbid string-built sql (T-035)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-035.`

---

## Fase 6 — TypeScript (D-07)
Branch da fase: `v2/phase-06-typescript`
> Se D-07 = "não adotar", marque T-036 a T-041 com `block` e o motivo "D-07: não adotado" e siga para a Fase 7.
> Justificativa da posição: logo depois do ORM, porque os tipos gerados pelo ORM passam a proteger as rotas, e antes do Zod (Fase 7), que gera tipos a partir dos schemas (`z.infer`).

### T-036 · Base TypeScript no server
**M · Origem:** novo · **Ler:** ENG, CONV §4
- **Objetivo:** estabelecer infraestrutura TypeScript no backend sem quebrar scripts dev e porta 3001.
- **Back:** `tsconfig.json` (`allowJs`, `checkJs: false`, `strict` para `.ts`), script `typecheck`, CI roda `typecheck`; conteúdo do script `dev` passa a rodar TS (ex.: `nodemon --exec tsx src/index.ts`), **mantendo o nome `dev` e a porta 3001** (exceção D-07).
- **Front:** sem impacto.
- **Teste antes:** `npm run typecheck --prefix server` falha (script inexistente).
- **Pronto quando:** typecheck verde; `npm run dev` sobe na 3001; testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build(server): add typescript baseline (T-036)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-036.`

### T-037 · `config`, `middleware`, `services`
**M · Origem:** novo · **Ler:** ENG, CONV §4
- **Objetivo:** migrar módulos centrais de configuração, middleware e serviços para TypeScript com tipagem estrita.
- **Back:** converter `config/env`, `middleware/requireStudent`, `services/srs`, `services/tenses` para `.ts` com tipos explícitos.
- **Front:** sem impacto.
- **Teste antes:** teste de tipos (`tsd`-like via `// @ts-expect-error` num arquivo `*.types.test.ts` compilado pelo typecheck): chamar `calculatePriority` sem campos obrigatórios deve dar erro de tipo; falha antes (arquivo `.js` não é checado).
- **Pronto quando:** typecheck e testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): convert config, middleware and services to ts (T-037)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-037.`

### T-038 · Rotas `students`, `tenses`, `sessions`, `dashboard`
**M · Origem:** novo · **Ler:** ENG, CONV §4
- **Objetivo:** migrar rotas de students, tenses, sessions e dashboard e seus repositórios para TypeScript.
- **Back:** converter as rotas e seus repositórios; `Request` tipado com `studentId`.
- **Front:** sem impacto; conferir Dashboard.
- **Teste antes:** teste de tipos: `req.studentId` é `number` nas rotas protegidas (`@ts-expect-error` ao atribuir string); falha antes.
- **Pronto quando:** typecheck e testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): convert students, tenses, sessions, dashboard to ts (T-038)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-038.`

### T-039 · Rotas `sentences` e `vocabulary`
**M · Origem:** novo · **Ler:** ENG, CONV §4
- **Objetivo:** migrar rotas de frases e vocabulário com seus repositórios e DTOs para TypeScript.
- **Back:** converter rotas e repositórios.
- **Front:** sem impacto; conferir Vocabulário e Frases.
- **Teste antes:** teste de tipos dos DTOs de vocabulário; falha antes.
- **Pronto quando:** typecheck e testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): convert sentences and vocabulary to ts (T-039)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-039.`

### T-040 · `reviews`, `index` e `strict` total
**M · Origem:** novo · **Ler:** ENG, CONV §4
- **Objetivo:** concluir conversão do backend para TypeScript e habilitar checagem estrita sem allowJs no server/src.
- **Back:** converter `reviews` e `index`; remover `allowJs` do server (testes podem continuar em JS com `ts-jest` ou `tsx`? — escolher o caminho sem dependência nova fora de D-10: rodar Jest sobre o build ou manter testes em JS importando `.ts` via `tsx`; registrar a escolha).
- **Front:** sem impacto.
- **Teste antes:** `typecheck` com `allowJs: false` falha enquanto houver `.js` em `src/`.
- **Pronto quando:** nenhum `.js` em `server/src`; typecheck, lint e testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): finish ts migration and enable strict (T-040)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-040.`

### T-041 · Base TypeScript no client
**M · Origem:** novo · **Ler:** ENG, CONV §4
- **Objetivo:** estabelecer base TypeScript no frontend com typecheck no Vite e cliente de API tipado.
- **Back:** sem impacto no server.
- **Front:** `tsconfig.json` do Vite (`allowJs`), script `typecheck`; `api.js` → `api.ts` com tipos das respostas (`Student`, `VocabularyItem`, `ReviewQueueItem`…); regra: arquivo novo ou reescrito nasce `.ts/.tsx`.
- **Teste antes:** `npm run typecheck --prefix client` falha (script inexistente); teste de tipos de `getVocabItem` devolvendo `VocabularyItem`.
- **Pronto quando:** typecheck, lint, testes e build do client verdes; telas sem mudança visual.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `build(client): add typescript baseline and typed api client (T-041)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-041.`

---

## Fase 7 — Segurança
Branch da fase: `v2/phase-07-security`

### T-042 · Tratamento central de erros + Toast
**M · Origem:** v1 T-071 · **Ler:** ENG, CONV §5
- **Objetivo:** unificar tratamento de erros da API com formato padronizado sem vazamento de SQL e exibir toasts no client.
- **Back:** `AppError` (`code`, `status`, `details`); handler único com formato `{ "error": { "code", "message", "details?" } }`; 404 para rota desconhecida; erro de banco vira `INTERNAL_ERROR` sem texto de SQL; `/api/health` deixa de expor `err.message`.
- **Front:** componente `Toast` + interceptor do axios que mostra mensagem amigável por `code`.
- **Teste antes:** Jest: rota que lança erro de banco responde 500 sem `SELECT`/`relation` no corpo; rota inexistente → 404 JSON. Vitest: interceptor exibe Toast. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: centralized api errors and client toasts (T-042)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-042.`

### T-043 · Zod: middleware + `students`, `sessions`, `tenses`
**M · Origem:** v1 T-072 (agora com Zod, D-10) · **Ler:** ENG, CONV §5
- **Objetivo:** introduzir middleware de validação Zod e proteger rotas de students, sessions e tenses.
- **Back:** `validate({ body, params, query })` com Zod; schemas em `server/src/schemas/`; erro 400 `VALIDATION_ERROR` com `details` por campo; ids sempre inteiros positivos.
- **Front:** formulário de novo estudante mostra erro ao lado do campo.
- **Teste antes:** Jest: `POST /api/students` com nome vazio ou de 500 caracteres → 400 com `details.name`; `PATCH /api/sessions/abc` → 400. Vitest: erro por campo renderizado. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: validate students, sessions and tenses input with zod (T-043)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-043.`

### T-044 · Zod em `vocabulary`
**M · Origem:** v1 T-072 · **Ler:** ENG, CONV §5
- **Objetivo:** validar todas as entradas de vocabulário com Zod protegendo contra payloads malformados ou injeção.
- **Back:** schemas de criação/edição (tamanhos, CEFR permitido, `type`, dificuldade 1–5, listas de significados e contextos).
- **Front:** Novo Verbo e Detalhes da Palavra mostram erros por campo.
- **Teste antes:** Jest: CEFR `Z9` → 400; payload com `student_id` extra é descartado; tentativa de injeção (`word: "x'; DROP TABLE students;--"`) é gravada como texto literal e a tabela continua existindo. Falham antes (os dois primeiros).
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: validate vocabulary input with zod (T-044)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-044.`

### T-045 · Zod em `reviews`, `sentences`, `dashboard`
**M · Origem:** v1 T-072 · **Ler:** ENG, CONV §5
- **Objetivo:** validar entradas e parâmetros de reviews, sentences e dashboard com Zod cobrindo 100% das rotas.
- **Back:** schemas de revisão (resultado permitido, categorias de erro), frases, parágrafos e query strings.
- **Front:** Banco de Frases e Parágrafos mostram erros por campo.
- **Teste antes:** Jest: `POST /api/reviews` com resultado inválido → 400; `GET /api/reviews/history?limit=-1` → 400. Falham antes.
- **Pronto quando:** toda rota tem schema (teste que percorre as rotas e confere `validate` registrado).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: validate reviews, sentences and dashboard input with zod (T-045)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-045.`

### T-046 · helmet, CORS e limite do corpo
**P · Origem:** novo · **Ler:** ENG, CONV §5
- **Objetivo:** proteger a API com headers de segurança HTTP (helmet), CORS restritivo e limite de payload.
- **Back:** `helmet()`; CORS a partir de `CORS_ORIGINS` (padrão `http://localhost:5173`); `express.json({ limit: '100kb' })`.
- **Front:** sem impacto (o proxy do Vite usa a mesma origem); conferir 2 telas.
- **Teste antes:** Jest: resposta tem `x-content-type-options`; origem `http://evil.test` não recebe `access-control-allow-origin`; corpo de 1 MB → 413. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(server): add helmet, strict cors and body limit (T-046)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-046.`

### T-047 · Rate limit
**P · Origem:** novo · **Ler:** ENG, CONV §5
- **Objetivo:** prevenir abuso de requisições com rate limiting proporcional e respostas amigáveis.
- **Back:** `express-rate-limit` global generoso (uso local) e mais rígido em rotas de escrita; desligável nos testes por variável.
- **Front:** mensagem amigável no Toast para `429 RATE_LIMITED`.
- **Teste antes:** Jest: N+1 requisições de escrita → 429 JSON; Vitest: Toast para 429. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: rate limit api with friendly client message (T-047)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-047.`

### T-048 · Logs com pino
**P · Origem:** novo · **Ler:** ENG, CONV §5
- **Objetivo:** implementar logging estruturado com Pino, request IDs rastreáveis e mascaramento de dados sensíveis.
- **Back:** `pino` + `pino-http` (request id em `X-Request-Id`; redação de `authorization`, `cookie`, `password`, `DB_PASSWORD`); `pino-pretty` só em desenvolvimento; trocar `console.*` do server.
- **Front:** Toast de erro 500 mostra o request id ("informe este código ao relatar o problema").
- **Teste antes:** Jest: logger com destino em memória não contém o valor de uma senha de teste; resposta tem `x-request-id`. Falham antes.
- **Pronto quando:** testes verdes; nenhum `console.` em `server/src` (lint).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: structured logging with pino and request ids (T-048)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-048.`

### T-049 · npm audit e documento de segurança
**P · Origem:** novo · **Ler:** ENG, CONV §5
- **Objetivo:** auditar vulnerabilidades de dependências no CI e documentar formalmente a arquitetura de segurança.
- **Back:** `npm audit fix` sem `--force` nas três pastas; exceções registradas; passo no CI `npm audit --omit=dev --audit-level=high`; atualizar `docs/seguranca-e-isolamento.md` com as camadas (Zod, helmet, CORS, rate limit, logs).
- **Front:** sem impacto.
- **Teste antes:** verificação: `npm audit --omit=dev --audit-level=high` registrado antes (pode falhar).
- **Pronto quando:** sem vulnerabilidade alta em produção (ou exceção justificada); CI com o passo.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore(security): audit dependencies and document security layers (T-049)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-049.`

---

## Fase 8 — Isolamento por estudante
Branch da fase: `v2/phase-08-isolation`

### T-050 · (concluída no legado) Isolamento ponta a ponta
Concluída no v1 (T-020 a T-030): dono em `vocabulary_items`, FKs compostas, migração de dados preservando tudo, `requireStudent`, `X-Student-Id` no axios, troca de estudante limpa as telas, 13 testes de isolamento, limitação documentada em `docs/seguranca-e-isolamento.md`. Nada a executar.

### T-051 · Recertificação automática
**M · Origem:** novo (reforça v1 T-029) · **Ler:** ENG, MLA §3–4
- **Objetivo:** garantir por testes automatizados no CI que nenhuma rota seja exposta sem proteção de isolamento por estudante.
- **Back:** teste que percorre todas as rotas registradas no Express e exige 400 sem `X-Student-Id` (lista explícita de exceções: `/api/health`, `GET/POST /api/students`, `/api/tenses`); teste de banco: inserir progresso de B apontando para palavra de A falha por FK composta (se ainda não existir).
- **Front:** sem impacto.
- **Teste antes:** criar uma rota de teste sem `requireStudent` dentro do teste → o verificador deve acusar; antes da tarefa o verificador não existe.
- **Pronto quando:** testes verdes; qualquer rota nova sem proteção quebra o CI.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(server): guard every route with student isolation check (T-051)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-051.`

### T-052 · Trocar de estudante pela Sidebar
**M · Origem:** novo (usabilidade) · **Ler:** ENG, MLA §4
- **Objetivo:** permitir troca rápida e segura de estudante ativo diretamente na Sidebar com recarregamento reativo de dados.
- **Back:** sem mudança (usa `GET /api/students`).
- **Front:** seletor de estudante no topo da Sidebar (nome + avatar com iniciais); trocar recarrega as telas com o novo `X-Student-Id`; "Gerenciar estudantes" leva à tela atual.
- **Teste antes:** Vitest: ao escolher outro estudante, `getApiStudentId()` muda e o conteúdo da página é remontado; falha antes (componente inexistente).
- **Pronto quando:** testes verdes; troca funciona sem voltar à tela inicial.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): switch student from sidebar (T-052)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-052.`

### T-053 · Estados vazios e pacote inicial
**M · Origem:** novo (usa a ideia de "pacote inicial" do MLA §2) · **Ler:** ENG, MLA §2
- **Objetivo:** fornecer feedback em estados vazios e mecanismo para importar pacote inicial de 20 verbos para novos estudantes.
- **Back:** `POST /api/students/:id/starter-pack` copia um baralho neutro (definido em `server/src/db/starter-pack.json`, 20 verbos comuns) para o estudante, em transação, sem duplicar se repetido.
- **Front:** Dashboard, Vocabulário e Estudar Agora mostram estado vazio com botões "Adicionar primeira palavra" e "Importar pacote inicial".
- **Teste antes:** Jest: estudante novo importa o pacote → 20 palavras dele e 0 nos outros; repetir não duplica. Vitest: estado vazio renderiza os dois botões. Falham antes.
- **Pronto quando:** testes verdes (incluindo isolamento).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: empty states and starter pack for new students (T-053)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-053.`

---

## Fase 9 — Tradução para inglês e i18n
Branch da fase: `v2/phase-09-english-i18n`
> Esta fase está **apenas planejada**. Justificativa da posição: depois do TypeScript (que renomeia arquivos) e antes da Experiência de estudo (que cria muitas telas novas, já com chaves de tradução).

### T-054 · Inventário de português
**P · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** inventariar todas as ocorrências de textos, comentários e rotas em português no repositório.
- **Back:** script somente leitura `scripts/find-portuguese.mjs` (acentos e palavras comuns: "não", "você", "erro", "palavra"…) gerando `docs/translation-inventory.md`: por arquivo, quantos comentários, textos de interface, mensagens de API e nomes de arquivo.
- **Front:** o inventário lista os textos de cada tela (vira checklist das T-056 a T-060).
- **Teste antes:** `node --test` do script com uma fixture em português → acusa; falha antes (script inexistente).
- **Pronto quando:** inventário gerado e commitado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: add portuguese-to-english translation inventory (T-054)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-054.`

### T-055 · Infra de i18n
**M · Origem:** novo (D-15) · **Ler:** ENG, CONV §6
- **Objetivo:** configurar a infraestrutura de i18n com suporte dinâmico a en e pt-BR e persistência de idioma.
- **Back:** sem impacto.
- **Front:** `i18next` + `react-i18next` + detector; `client/src/i18n/` com `locales/en/*.json` e `locales/pt-BR/*.json` por tela (namespaces); seletor de idioma na Sidebar salvo no `localStorage`.
- **Teste antes:** Vitest: com idioma `en` a Sidebar mostra "Study now"; com `pt-BR`, "Estudar agora"; falha antes.
- **Pronto quando:** testes verdes; trocar idioma atualiza a Sidebar sem recarregar.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): add i18n with en and pt-BR (T-055)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-055.`

### T-056 · Textos: StudentSelect, Sidebar, UI, App
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** internacionalizar telas de seleção de estudante, sidebar, navegação e componentes comuns.
- **Back:** sem impacto.
- **Front:** trocar todo texto fixo por `t('...')`; comentários desses arquivos em inglês.
- **Teste antes:** teste por arquivo: renderizar em `en` não contém nenhum texto do inventário em português; falha antes.
- **Pronto quando:** testes verdes; as telas funcionam nos dois idiomas.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): translate student select, sidebar and shared ui (T-056)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-056.`

### T-057 · Textos: Dashboard e Progresso
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** internacionalizar textos, datas e gráficos do Dashboard e da tela de Progresso.
- **Front:** idem T-056, incluindo rótulos de gráficos (Chart.js) e datas com `Intl.DateTimeFormat` do idioma ativo.
- **Back:** sem impacto.
- **Teste antes:** idem T-056 para as duas telas; falha antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): translate dashboard and progress (T-057)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-057.`

### T-058 · Textos: Vocabulário, Detalhes, Novo Verbo
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** internacionalizar telas de Vocabulário, Detalhes da Palavra e formulário de Novo Verbo.
- **Front:** idem T-056.
- **Back:** sem impacto.
- **Teste antes:** idem para as três telas; falha antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): translate vocabulary screens (T-058)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-058.`

### T-059 · Textos: StudySession parte 1
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** internacionalizar configuração da sessão de estudos, seleção de modo, filtros e quizzes personalizados.
- **Front:** escolha de modo, filtro CEFR, configuração e cartões do quiz personalizado; categorias de erro com chave estável (`grammar`, `tense`…) e rótulo traduzido.
- **Back:** sem impacto.
- **Teste antes:** idem para a parte 1; falha antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): translate study session setup and custom quiz (T-059)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-059.`

### T-060 · Textos: StudySession parte 2 + Frases, Parágrafos, Busca
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** internacionalizar cartões de estudo, avaliação, resultados, frases, parágrafos e busca.
- **Front:** cartão, avaliação, resultado; telas de Frases, Parágrafos e Busca.
- **Back:** sem impacto.
- **Teste antes:** idem; falha antes.
- **Pronto quando:** nenhuma tela com texto fixo em português (inventário zerado no client).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): translate study card, sentences, paragraphs and search (T-060)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-060.`

### T-061 · Server em inglês
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** traduzir para inglês todas as mensagens de erro da API, JSDoc e comentários do backend.
- **Back:** mensagens de erro da API e comentários/JSDoc em inglês em rotas, serviços, middleware, config e repositórios; o `code` do erro é estável.
- **Front:** o client traduz mensagens a partir do `code` (`errors.VALIDATION_ERROR` etc.) em vez de exibir o texto do server.
- **Teste antes:** teste que roda o inventário em `server/src` (exceto migrações) e espera zero ocorrências; falha antes.
- **Pronto quando:** testes verdes; inventário do server zerado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor(server): translate api messages and comments to english (T-061)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-061.`

### T-062 · Testes, seed, scripts e utils em inglês
**P · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** traduzir nomes de suítes de testes, scripts e documentação interna de utils sem quebrar dados de usuário.
- **Back:** nomes de testes (`describe/it`), comentários de seed e scripts em inglês. **Não editar migrações já aplicadas** (o checksum da T-018 bloqueia). O conteúdo de estudo (significados em português) permanece, pois é dado do usuário.
- **Front:** testes do client e `utils/tts.js` em inglês.
- **Teste antes:** inventário em `server/tests`, `client/src/test`, `scripts/` espera zero; falha antes.
- **Pronto quando:** inventário zerado nessas pastas; suítes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore: translate tests, seed and scripts to english (T-062)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-062.`

### T-063 · Nomes de arquivos e guarda no CI
**M · Origem:** novo · **Ler:** ENG, CONV §6
- **Objetivo:** padronizar nomes de arquivos em inglês e criar guarda automatizada no CI contra regressão de idioma.
- **Back:** renomear com `git mv` (ex.: `docs/seguranca-e-isolamento.md` → `docs/security-and-isolation.md`; `package.json` do server: `description` em inglês e `name` coerente); atualizar todos os links; `scripts/check-portuguese.mjs` no CI com allowlist (`locales/pt-BR`, migrações aplicadas, `README.pt-BR.md`, `plano-de-acao/`, `skills/`).
- **Front:** sem mudança visual.
- **Teste antes:** o check no CI falha enquanto houver nome/arquivo em português fora da allowlist.
- **Pronto quando:** check verde; nenhum link quebrado (`git grep` dos nomes antigos vazio).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore: rename files to english and guard against portuguese in code (T-063)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-063.`

---

## Fase 10 — Experiência de estudo (quiz como formato principal)
Branch da fase: `v2/phase-10-study-experience`
> Objetivo da fase: o estudante abre "Estudar Agora" e cai num **quiz estilo Anki**, alimentado por tudo o que já existe no banco (significados, frases, contextos, parágrafos, formas verbais). Frases e parágrafos deixam de ser dados mortos.

### T-064 · Estado FSRS no banco
**M · Origem:** novo (D-14) · **Ler:** ENG, CONV §7
- **Objetivo:** criar estrutura de schema FSRS no banco de dados e migrar estados de cartões existentes.
- **Back:** `docs/adr/0002-fsrs.md`; migration com colunas FSRS em `student_vocabulary` (`due`, `stability`, `difficulty`, `state`, `reps`, `lapses`, `last_review`) e tabela `review_logs` (`rating` 1–4, `state`, `elapsed_days`, `scheduled_days`, `reviewed_at`, FKs compostas pelo dono); backfill: `due = next_review_at`, `state` a partir de `mastery_level`.
- **Front:** sem impacto ainda (dados preparados para T-066/T-067).
- **Teste antes:** Jest: após migrar, toda linha de `student_vocabulary` tem `due` não nulo; `review_logs` rejeita `rating = 5`; FK composta impede log de B sobre palavra de A. Falham antes.
- **Pronto quando:** testes verdes; backup feito antes; drift do ORM atualizado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(db): add fsrs card state and review logs (T-064)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-064.`

### T-065 · Serviço `scheduler`
**P · Origem:** novo · **Ler:** ENG, CONV §7
- **Objetivo:** criar serviço determinístico de agendamento FSRS encapsulando cálculos de repetição e intervalos.
- **Back:** `server/src/services/scheduler.ts` com funções puras sobre `ts-fsrs`: `rate(card, rating, now)` e `preview(card, now)` (intervalo de cada botão).
- **Front:** sem impacto (consumido pela T-066).
- **Teste antes:** Jest: cartão novo com Again vence em minutos; intervalos Easy > Good > Hard; datas determinísticas com `now` fixo. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(server): fsrs scheduler service (T-065)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-065.`

### T-066 · API de estudo
**M · Origem:** novo · **Ler:** ENG, CONV §7
- **Objetivo:** fornecer endpoints de fila e submissão de respostas de estudo com algoritmo FSRS e isolamento.
- **Back:** `GET /api/study/queue?mode=&level=&limit=` (vencidos primeiro, desempate pela prioridade de erros de `srs.ts`; novos limitados por dia) e `POST /api/study/answer` (`rating` 1–4, atualiza FSRS, grava `review_logs` e `reviews`, soma na sessão). Rotas antigas de `/api/reviews` continuam funcionando. Zod e isolamento desde o início.
- **Front:** `api.ts` ganha `getStudyQueue` e `answerCard` tipados.
- **Teste antes:** Jest: responder Good tira o cartão da fila de hoje; B não responde cartão de A (404); `rating` 0 → 400. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(api): study queue and answer endpoints with fsrs (T-066)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-066.`

### T-067 · Cartão de quiz estilo Anki
**M · Origem:** novo (resolve "o quiz não aparece quando vou estudar") · **Ler:** ENG, CONV §7
- **Objetivo:** implementar cartão de quiz interativo estilo Anki com teclado e prévias de intervalo como fluxo principal.
- **Back:** sem mudança (usa T-066).
- **Front:** componente `QuizCard` (`.tsx`): frente → "Mostrar resposta" (espaço) → quatro botões Again/Hard/Good/Easy com a prévia do intervalo ("10 min", "1 d", "3 d", "8 d") e atalhos 1–4; barra de progresso da sessão; TTS existente no verso. Vira o fluxo padrão de "Estudar Agora" (os modos atuais viram filtros da fila).
- **Teste antes:** Vitest: cartão mostra 4 botões após revelar; tecla `3` envia `rating: 3`; fila vazia mostra "Tudo revisado por hoje". Falham antes.
- **Pronto quando:** testes verdes; sessão completa jogável no navegador.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): anki-style quiz card as default study flow (T-067)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-067.`

### T-068 · Tipos de cartão a partir dos dados existentes
**M · Origem:** novo (dá serventia a frases e contextos) · **Ler:** ENG, CONV §7
- **Objetivo:** construir múltiplos tipos dinâmicos de cartões de quiz (significado, lacunas, colocações, formas verbais).
- **Back:** `services/cardBuilder.ts` monta, para cada item da fila, um tipo: `meaning` (palavra → significado), `reverse` (significado → palavra), `cloze` (frase do estudante com a palavra oculta), `collocation` (contexto: "avoid ___"), `verb_forms` (base → past/participle). Rotação por item para variar.
- **Front:** `QuizCard` renderiza cada tipo (lacuna com campo de resposta opcional e comparação ao revelar).
- **Teste antes:** Jest: palavra com frase gera `cloze` que não contém a palavra na frente; verbo irregular gera `verb_forms` com as formas de `verb_forms`. Vitest: cada tipo renderiza. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: build quiz card types from sentences, contexts and verb forms (T-068)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-068.`

### T-069 · API de quizzes personalizados
**M · Origem:** novo (usa as tabelas do v1 T-042, que estão sem rota) · **Ler:** ENG, CONV §7, MLA §6
- **Objetivo:** fornecer API completa para persistência e execução de quizzes personalizados com controle de escopo.
- **Back:** `/api/quizzes` (listar, criar com `block_size` 5 ou 10, editar, excluir) e `/api/quizzes/:id/questions`; `POST /api/quizzes/:id/start` cria sessão `custom_quiz` com `quiz_id`; respostas usam `POST /api/study/answer`. Zod + isolamento.
- **Front:** `api.ts` com as funções tipadas.
- **Teste antes:** Jest: CRUD completo; `block_size` 7 → 400; B não vê quiz de A. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(api): persisted custom quizzes (T-069)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-069.`

### T-070 · Tela "Meus quizzes"
**M · Origem:** novo · **Ler:** ENG, CONV §7
- **Objetivo:** criar tela dedicada para gerenciar e executar quizzes personalizados salvos no frontend.
- **Back:** sem mudança.
- **Front:** rota `/quizzes`: lista, criar (escolher palavras/contextos, bloco 5 ou 10), editar, jogar com o `QuizCard`, resultado final (acertos, tempo). O antigo modal de quiz em memória é substituído.
- **Teste antes:** Vitest: criar quiz chama a API e aparece na lista; jogar mostra o primeiro cartão. Falham antes.
- **Pronto quando:** testes verdes; quiz salvo reaparece após recarregar.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): my quizzes screen (T-070)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-070.`

### T-071 · Prática com parágrafos
**M · Origem:** novo (dá serventia a parágrafos) · **Ler:** ENG, CONV §7
- **Objetivo:** viabilizar prática de leitura assistida e exercícios de lacunas a partir de parágrafos cadastrados.
- **Back:** `GET /api/study/paragraphs/:id` devolve o texto com lacunas nas palavras ligadas em `paragraph_vocabulary`; respostas viram `answerCard` de cada palavra.
- **Front:** botão "Praticar" em Parágrafos abre leitura (com TTS) e depois o modo lacunas; resultado por palavra.
- **Teste antes:** Jest: lacunas correspondem às palavras ligadas; escopo do estudante. Vitest: lacunas renderizadas. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: paragraph reading and cloze practice (T-071)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-071.`

### T-072 · Gerador de frases por tempo verbal
**M · Origem:** v1 T-050 e T-051 · **Ler:** ENG, MLA §8
- **Objetivo:** implementar gerador determinístico de frases baseado em regras gramaticais e tempos verbais sem dependência externa.
- **Back:** `services/sentenceGenerator.ts`: funções puras (verbo + tempo + sujeito → frase) com templates e regras de conjugação (-s/-es, -ed, -ing, y→ied, dobra de consoante), irregulares via `verb_forms`, complementos vindos dos contextos cadastrados. Sem rede, sem IA.
- **Front:** sem impacto ainda (consumido pela T-074).
- **Teste antes:** Jest por tempo verbal da tabela `tenses` com verbos regulares e irregulares (`go`, `study`, `stop`, `avoid`); falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(server): rule-based sentence generator (T-072)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-072.`

### T-073 · Endpoint de geração
**P · Origem:** v1 T-052 · **Ler:** ENG, MLA §8
- **Objetivo:** expor endpoint de geração pontual de frases gramaticais com validação Zod e isolamento.
- **Back:** `POST /api/sentences/generate` (`vocabularyItemId`, `tenseCodes[]`, `subject?`) devolve sugestões sem gravar; escopo do estudante; Zod.
- **Front:** `api.ts` com `generateSentences`.
- **Teste antes:** Jest: devolve uma frase por tempo pedido; palavra de outro estudante → 404; nada gravado em `sentences`. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(api): sentence generation endpoint (T-073)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-073.`

### T-074 · "Gerar frases" na interface
**M · Origem:** v1 T-053 e T-054 · **Ler:** ENG, MLA §8
- **Objetivo:** integrar interface de geração, revisão e aprovação de frases para alimentar novos cartões cloze.
- **Back:** salvar aprovadas com `source = 'generated'`.
- **Front:** botão "Gerar frases" em Detalhes da Palavra e Banco de Frases; lista de sugestões com editar/aprovar/descartar; aprovadas passam a alimentar os cartões `cloze`. `docs/sentence-generator.md` com os limites (frases simples e gramaticais, nem sempre naturais).
- **Teste antes:** Vitest: aprovar envia `source: 'generated'`; descartar não chama a API. Falham antes.
- **Pronto quando:** testes verdes; frase aprovada aparece num cartão de lacuna.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): generate and approve sentences (T-074)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-074.`

### T-075 · API de estatísticas de aprendizado
**M · Origem:** novo · **Ler:** ENG, CONV §7
- **Objetivo:** fornecer API de métricas de retenção real, projeção de vencimentos e histórico anual de revisões.
- **Back:** `GET /api/stats/learning`: retenção real (Good/Easy ÷ total em cartões maduros), revisões por dia (365 dias), previsão de vencimentos (7 dias), sequência de dias estudados, cartões por estado FSRS.
- **Front:** `api.ts` com o tipo `LearningStats`.
- **Teste antes:** Jest com dados fixos conhecidos: retenção = valor esperado; dias sem estudo quebram a sequência; isolamento. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(api): learning statistics endpoint (T-075)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-075.`

### T-076 · Dashboard de aprendizado
**M · Origem:** novo · **Ler:** ENG, CONV §7
- **Objetivo:** implementar dashboard visual de aprendizado com heatmap anual em CSS nativo, retenção e previsões.
- **Back:** sem mudança.
- **Front:** no Dashboard: medidor de retenção, heatmap de 365 dias (grid CSS próprio, sem biblioteca), gráfico de revisões por dia e previsão (Chart.js já existente), sequência de dias e botão "Estudar agora (N vencidos)".
- **Teste antes:** Vitest com dados mockados: heatmap tem 365 células; dia com 0 revisões tem a classe vazia; botão mostra N. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): learning dashboard with heatmap and retention (T-076)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-076.`

### T-077 · Aposentar o fluxo antigo
**M · Origem:** v1 T-070 · **Ler:** ENG, CONV §7
- **Objetivo:** aposentar definitivamente componentes e código legado de avaliação de 3 botões em prol do fluxo FSRS.
- **Back:** mapear Difícil/Parcial/Fácil → Again/Hard/Good onde ainda houver chamada; remover código morto do SRS antigo que não é mais usado; `docs/srs-algorithm.md` (FSRS + prioridade por erros, com exemplos).
- **Front:** remover telas/estados antigos de avaliação de 3 botões.
- **Teste antes:** teste que garante que nenhuma tela chama `submitReview` antigo (busca no código) e testes do mapeamento; falham antes.
- **Pronto quando:** testes verdes; documento criado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `refactor: retire legacy 3-button review flow (T-077)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-077.`

### T-078 · Revisar a matriz de usabilidade
**P · Origem:** v1 T-061 · **Ler:** ENG
- **Objetivo:** auditar e atualizar a matriz de usabilidade garantindo que todos os recursos tenham destino no V2.
- **Back:** reler `docs/usability-matrix.md` (T-004) contra o código.
- **Front:** cada ❌/⚠️ fica ✅ ou vira item do roadmap (ou `add-feature`).
- **Teste antes:** verificação: contar ❌ antes (registrar o número).
- **Pronto quando:** zero ❌ sem destino.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: update usability matrix after study experience (T-078)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-078.`

---

## Fase 11 — Voz (Web Speech API, gratuita)
Branch da fase: `v2/phase-11-voice`

### T-079 · `useSpeech` e preferências de voz
**M · Origem:** novo (evolui `utils/tts.js`) · **Ler:** ENG, CONV §8
- **Objetivo:** fornecer hook useSpeech e interface de preferências locais de síntese de voz (TTS).
- **Back:** sem impacto.
- **Front:** hook `useSpeech` (speechSynthesis) e tela "Preferências" com voz, sotaque (en-US/en-GB), velocidade e "falar automaticamente ao revelar", salvos no `localStorage`.
- **Teste antes:** Vitest com `speechSynthesis` mockado: velocidade escolhida é usada; preferências persistem. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): speech hook and voice preferences (T-079)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-079.`

### T-080 · Reconhecimento de fala e pontuação
**M · Origem:** novo (D-18) · **Ler:** ENG, CONV §8
- **Objetivo:** implementar reconhecimento de voz opcional com comparação textual entre o falado e o esperado.
- **Back:** sem impacto.
- **Front:** hook `usePronunciation` com detecção de suporte (`SpeechRecognition`/`webkitSpeechRecognition`); função pura `scorePronunciation(expected, transcript)` (normalização + Levenshtein → 0–100); aviso quando o navegador não suporta e que no Chrome o áudio é processado por servidor do Google.
- **Teste antes:** Vitest da função: igual = 100; uma letra trocada < 100 e > 80; navegador sem suporte esconde o botão. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat(client): speech recognition with pronunciation score (T-080)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-080.`

### T-081 · Prática de pronúncia gravada
**M · Origem:** novo (dá uso à tabela `pronunciation_practice`) · **Ler:** ENG, CONV §8
- **Objetivo:** persistir histórico de prática de pronúncia com métricas de evolução por estudante.
- **Back:** `POST /api/pronunciation` e `GET /api/pronunciation/trend` (Zod + isolamento).
- **Front:** botão "Falar" no `QuizCard` (quando suportado) mostrando a pontuação; gráfico de tendência na tela Progresso.
- **Teste antes:** Jest: grava e devolve tendência só do estudante; Vitest: botão envia pontuação. Falham antes.
- **Pronto quando:** testes verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `feat: record pronunciation practice and show trend (T-081)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-081.`

---

## Fase 12 — Testes de ponta a ponta e cobertura
Branch da fase: `v2/phase-12-e2e-coverage`

### T-082 · Playwright e teste de fumaça
**M · Origem:** novo · **Ler:** ENG, CONV §9
- **Objetivo:** configurar a infraestrutura de testes de ponta a ponta com Playwright e validar fluxo crítico inicial de smoke.
- **Back:** `playwright.config.ts` na raiz com `webServer` subindo server (banco de teste) e client.
- **Front:** teste: abrir o app, criar estudante, adicionar palavra, vê-la no Vocabulário. Instalar só o Chromium do Playwright.
- **Teste antes:** o próprio teste E2E falha antes (configuração inexistente).
- **Pronto quando:** `npm run test:e2e` verde localmente.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(e2e): add playwright with smoke test (T-082)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-082.`

### T-083 · E2E de estudo e isolamento
**M · Origem:** novo · **Ler:** ENG, CONV §9
- **Objetivo:** cobrir via E2E o fluxo completo de estudo/revisão com cartões e a garantia visual e de rotas de isolamento por estudante.
- **Front:** E2E 1: estudar, revelar, Good, cartão sai da fila. E2E 2: estudante B não vê a palavra de A, nem pela URL direta.
- **Back:** fixtures de dados via API no `beforeEach`.
- **Teste antes:** escrever os dois testes e vê-los passar só depois de os seletores (`data-testid`) existirem; antes falham.
- **Pronto quando:** E2E verdes.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(e2e): study flow and isolation (T-083)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-083.`

### T-084 · Metas de cobertura
**P · Origem:** novo · **Ler:** ENG, CONV §9
- **Objetivo:** estabelecer limites mínimos obrigatórios de cobertura de código no backend e frontend no CI.
- **Back:** Jest `--coverage` com `coverageThreshold` (server ≥ 70% linhas).
- **Front:** Vitest com `@vitest/coverage-v8` e meta (client ≥ 50% linhas, subindo depois).
- **Teste antes:** rodar com a meta acima do valor atual → falha (prova que a meta é aplicada); depois ajustar ao alvo.
- **Pronto quando:** metas no CI; valores registrados.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test: enforce coverage thresholds (T-084)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-084.`

### T-085 · E2E no CI
**P · Origem:** novo · **Ler:** ENG, CONV §9
- **Objetivo:** integrar a execução dos testes E2E do Playwright na pipeline do GitHub Actions a cada PR.
- **Back:** job `e2e` no CI (PostgreSQL de serviço, Chromium, relatório HTML como artefato).
- **Front:** os E2E da T-082/T-083 rodam a cada PR.
- **Teste antes:** verificação: job inexistente no workflow.
- **Pronto quando:** após seu push, o job `e2e` fica verde.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `ci: run playwright e2e (T-085)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-085.`

---

## Fase 13 — Documentação e open source
Branch da fase: `v2/phase-13-docs`

### T-086 · OpenAPI e Swagger UI
**M · Origem:** novo · **Ler:** ENG, CONV §5
- **Objetivo:** gerar especificação OpenAPI interativa com Swagger UI a partir dos schemas Zod em ambiente de desenvolvimento.
- **Back:** gerar o OpenAPI a partir dos schemas Zod (`@asteasolutions/zod-to-openapi`); `GET /api/docs.json` e Swagger UI em `/api/docs` só quando `NODE_ENV !== 'production'`.
- **Front:** link "API docs" no rodapé da Sidebar (só em desenvolvimento).
- **Teste antes:** Jest: `/api/docs.json` contém todas as rotas registradas; falha antes.
- **Pronto quando:** teste verde; Swagger abre no navegador.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs(api): openapi spec and swagger ui (T-086)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-086.`

### T-087 · LICENSE e arquivos de comunidade
**P · Origem:** v1 T-080, T-081, T-087 · **Ler:** ENG, OSB, OSC
- **Objetivo:** padronizar a documentação open source do repositório com licença MIT, guia de contribuição, conduta e segurança.
- **Back:** `LICENSE` (MIT com ano e autor de D-03), `CONTRIBUTING.md` (setup, testes, branches por fase, Conventional Commits, **`git add .` na raiz**), `CODE_OF_CONDUCT.md` (Contributor Covenant), `SECURITY.md`.
- **Front:** sem impacto.
- **Teste antes:** verificação: links do README para esses arquivos estão quebrados (arquivos inexistentes).
- **Pronto quando:** arquivos criados; links funcionam.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: add license and community files (T-087)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-087.`

### T-088 · Modelos de issue/PR e CHANGELOG
**P · Origem:** v1 T-087 · **Ler:** ENG, OSC
- **Objetivo:** criar templates estruturados para issues e PRs no GitHub e manter CHANGELOG histórico das versões.
- **Back:** `.github/ISSUE_TEMPLATE/bug_report.yml` e `feature_request.yml`; `.github/PULL_REQUEST_TEMPLATE.md` (checklist: testes, lint, front conferido, `git add .` na raiz); `CHANGELOG.md` (Keep a Changelog) resumindo V1 e V2 por fase.
- **Front:** sem impacto.
- **Teste antes:** verificação: arquivos inexistentes.
- **Pronto quando:** arquivos criados.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: add issue/pr templates and changelog (T-088)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-088.`

### T-089 · Segredos e dados pessoais
**P · Origem:** v1 T-082, T-083, T-084 · **Ler:** ENG, OSB
- **Objetivo:** auditar o repositório contra exposição de segredos e credenciais no git history e neutralizar dados de seed.
- **Back:** `git log --all -- .env server/.env` (se algum `.env` real já foi commitado: avisar e recomendar trocar a senha); conferir `.gitignore` e `.env.example`; seeds com dados neutros (perguntar antes de trocar o nome do estudante inicial).
- **Front:** sem impacto (seed neutra muda o que aparece num banco novo).
- **Teste antes:** verificação: `git log --all --oneline -- .env server/.env` registrado.
- **Pronto quando:** nenhum segredo no histórico (ou aviso dado) e seed neutra.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `chore: verify secrets and neutralize seed data (T-089)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-089.`

### T-090 · Capturas de tela automáticas
**P · Origem:** novo · **Ler:** ENG, README-SKILL
- **Objetivo:** automatizar a captura de screenshots limpos da aplicação via Playwright para documentação do projeto.
- **Back:** script Playwright `npm run screenshots` gerando `docs/images/*.png` (seleção de estudante, quiz, dashboard, detalhes da palavra) com dados do seed.
- **Front:** é a vitrine do front no README.
- **Teste antes:** verificação: pasta `docs/images/` inexistente.
- **Pronto quando:** imagens geradas e leves (< 300 KB cada).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: automated screenshots (T-090)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-090.`

### T-091 · README final (pt-BR)
**M · Origem:** v1 T-085 e T-086 · **Ler:** ENG, README-SKILL, OSC
- **Objetivo:** consolidar a versão final do README.md em português com documentação completa, badges e links verificados.
- **Back:** rodar `py skills/scripts/detect_stack.py . --markdown`; atualizar stack, endpoints (link para `/api/docs`), número real de tabelas, badges verdadeiros (CI, licença, Node, PostgreSQL), capturas, links conferidos; manter as seções de guia de execução.
- **Front:** capturas da T-090 no README.
- **Teste antes:** verificação: script que extrai links relativos do README e confere se os arquivos existem; rodado antes, registra os quebrados.
- **Pronto quando:** zero link quebrado; versões batem com os `package.json`.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: final portuguese readme (T-091)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-091.`

---

## Fase 14 — Prova de fogo
Branch da fase: `v2/phase-14-fire-test`

### T-092 · Seguir o README como um estranho
**M · Origem:** v1 T-090 · **Ler:** ENG, README-SKILL
- **Objetivo:** executar teste de validação final executando o onboarding e uso do projeto a partir do zero seguindo estritamente o README.
- **Back:** clonar o repositório numa pasta temporária fora do projeto; banco vazio (Docker ou banco novo local); seguir **só** o README: `npm run setup`, `.env`, `migrate`, `seed`, `npm run dev`; rodar os testes e os E2E.
- **Front:** abrir todas as telas no banco recém-criado; estudar uma sessão completa.
- **Teste antes:** checklist de passos do README escrita antes; cada passo marcado passou/falhou.
- **Pronto quando:** todos os passos passam sem conhecimento externo; cada atrito vira `add-feature` (e, se pequeno, corrigido no README na mesma sessão).
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: fire test fixes (T-092)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-092.`

---

## Fase 15 — Tradução final
Branch da fase: `v2/phase-15-final-translation`

### T-093 · README em inglês
**M · Origem:** novo (D-08) · **Ler:** ENG, README-SKILL
- **Objetivo:** disponibilizar versão integralmente traduzida em inglês do README.md mantendo a versão pt-BR com links cruzados.
- **Back:** `git mv README.md README.pt-BR.md`; novo `README.md` em inglês com o mesmo conteúdo; links cruzados no topo dos dois.
- **Front:** sem impacto.
- **Teste antes:** verificação de links dos dois READMEs (script da T-091).
- **Pronto quando:** os dois READMEs com zero links quebrados.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: english readme with pt-BR version (T-093)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-093.`

### T-094 · Planejamento em inglês
**M · Origem:** novo (D-16) · **Ler:** ENG
- **Objetivo:** traduzir os arquivos internos de planejamento para inglês (opcional, pós-prova de fogo), mantendo a pasta plano-de-acao/ intacta (D-16).
- **Back:** renomear `PLANO.md` → `PLAN.md`, `TAREFAS.md` → `TASKS.md`, `RETOMAR.md` → `RESUME.md`, `LINHA-DO-TEMPO.md` → `TIMELINE.md` mantendo a pasta `plano-de-acao/` (conforme D-16); ajustar `plan_tool.py` (caminhos e mensagens; **exceção de alteração de script registrada em D-16**) nas duas cópias; traduzir `skills/`; `legado/` permanece como está (histórico).
- **Front:** sem impacto.
- **Teste antes:** `py plano-de-acao/plan_tool.py status` falha se referências internas estiverem quebradas.
- **Pronto quando:** `status` funciona no fluxo traduzido; nenhum link interno quebrado.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `docs: translate planning workflow to english (T-094)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-094.`

---

## Funcionalidades Adicionadas

### T-095 · Parametrizar LIMIT/OFFSET e sanitizar erros da API
**P · Origem:** Funcionalidade adicionada Nº 1 (autorizada na M-08) · **Ler:** ENG, CONV §3
- **Objetivo:** eliminar risco de erro e injeção por interpolação de `LIMIT` em `reviews.js:320` e impedir vazamento de mensagens internas do banco (`err.message`) nas respostas da API.
- **Back:** em `server/src/routes/reviews.js:320`, parametrizar o `LIMIT` via placeholder `$n` com fallback seguro (`Math.max(1, parseInt(limit, 10) || 50)`); criar helper centralizado de resposta de erro `sendError(res, err, defaultMsg, status=500)` que loga o erro no servidor mas responde ao cliente com mensagem segura e genérica (`{ error: defaultMsg }`), sem expor `err.message` bruta do PostgreSQL; substituir os vazamentos críticos nas rotas de `reviews.js`, `vocabulary.js` e `sentences.js`.
- **Front:** conferir telas afetadas (Fila de Revisão, Detalhes da Palavra); garantir que alertas e toasts tratem erro genérico amigável.
- **Teste antes:** teste Supertest enviando `limit=invalid_string` em `GET /api/reviews/history` esperando `200 OK` com limit padrão (hoje falha/quebra com erro de sintaxe SQL); teste forçando falha de banco e verificando que a resposta HTTP NÃO contém detalhes internos de SQL.
- **Pronto quando:** nenhum `LIMIT` ou `OFFSET` interpolado por `${...}` em `server/src/`; respostas de erro não expõem detalhes de banco; testes passando.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `fix(api): parameterize review limit and sanitize error responses (T-095)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-095.`

### T-096 · Corrigir testes legados do client (srs.test.js e tts.test.js)
**P · Origem:** Funcionalidade adicionada Nº 2 (autorizada na M-08) · **Ler:** ENG
- **Objetivo:** resolver as falhas conhecidas da suíte Vitest do client herdadas do V1 para restabelecer baseline 100% verde no frontend.
- **Back:** sem impacto.
- **Front:** ajustar `client/src/test/srs.test.js` e `client/src/test/tts.test.js` para corresponder ao comportamento e assinaturas atuais das funções `calculateNextInterval` e `speakText` (ou mocks de Web Speech API / TTS); eliminar falhas de asserção de intervalo e mocks ausentes.
- **Teste antes:** rodar `npm run test:run --prefix client` e ver as falhas específicas registradas no baseline; rodar após correções e vê-las passar.
- **Pronto quando:** `npm run test:run --prefix client` roda com zero falhas em todos os arquivos de teste do cliente.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(client): fix legacy srs and tts vitest suites (T-096)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-096.`

### T-097 · Corrigir teste do server de status red vs yellow em reviews
**P · Origem:** Funcionalidade adicionada Nº 2 (autorizada na M-08) · **Ler:** ENG
- **Objetivo:** corrigir a falha do baseline da API backend em `server/tests/api.test.js` onde `POST /api/reviews` falha na checagem de transição de status red para yellow.
- **Back:** investigar e alinhar o teste em `server/tests/api.test.js` ou a lógica de status em `server/src/routes/reviews.js` para que a contagem e os critérios de transição de repetição espaçada (red -> yellow -> green) sejam rigorosamente consistentes.
- **Front:** sem impacto.
- **Teste antes:** rodar `npm test --prefix server` e ver a falha isolada em `POST /api/reviews` status red vs yellow.
- **Pronto quando:** `npm test --prefix server` roda com 100% dos testes passando sem falhas.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3.
- **Commit:** `test(server): fix review status red to yellow transition test (T-097)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-097.`

---

### T-098 · Sanitizar LIMIT interpolado em reviews.js (SEC-01)
**P · Origem:** Auditoria de segurança M-37/SEC-01 · **Ler:** ENG
- **Objetivo:** Eliminar a interpolação direta de `limit` na query SQL do endpoint `GET /api/reviews/history`, substituindo por bound parameter para prevenir SQL injection.
- **Back:** Em `server/src/routes/reviews.js` linha 320, substituir:
  ```js
  query += ` ORDER BY r.reviewed_at DESC LIMIT ${parseInt(limit)}`;
  ```
  por:
  ```js
  const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 20, 200));
  params.push(safeLimit);
  query += ` ORDER BY r.reviewed_at DESC LIMIT $${params.length}`;
  ```
  Garantir que `limit` nunca seja injetado diretamente na string SQL. Valor máximo permitido: 200.
- **Front:** sem impacto.
- **Teste antes:** rodar `npm test --prefix server` e verificar que os testes de `/api/reviews/history` passam. Confirmar que passar `limit=abc` ou `limit=999999` retorna resultado limitado a 200 sem erro 500.
- **Pronto quando:** nenhuma interpolação direta de variável em query SQL existe em `reviews.js`. `npm test --prefix server` passa.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3. Sugerir `git add .` e `git commit -m "fix(sec): sanitize LIMIT param in reviews history query (T-098)"`.
- **Commit:** `fix(sec): sanitize LIMIT param in reviews history query (T-098)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-098.`

---

### T-099 · Helper centralizado de tratamento de erros sem vazar err.message (SEC-02)
**P · Origem:** Auditoria de segurança M-37/SEC-02 · **Ler:** ENG
- **Objetivo:** Criar um middleware centralizado `errorHandler` que impeça o vazamento de `err.message` interno nas respostas HTTP em ambiente de produção, eliminando o padrão repetido em 35+ locais.
- **Back:**
  1. Criar `server/src/middleware/errorHandler.js`:
     ```js
     function errorHandler(err, req, res, next) {
       console.error(err.stack || err.message);
       const isDev = process.env.NODE_ENV === 'development';
       res.status(err.status || 500).json({
         error: isDev ? err.message : 'Internal Server Error',
       });
     }
     module.exports = { errorHandler };
     ```
  2. Registrar no `server/src/index.js` como último middleware (após todas as rotas).
  3. Nos arquivos de rota, substituir os blocos `catch (err) { res.status(500).json({ error: err.message }); }` por `next(err)` para delegar ao handler centralizado.
  4. Priorizar a substituição em: `students.js`, `sessions.js`, `middleware/requireStudent.js` (todos usam o padrão inseguro).
- **Front:** sem impacto.
- **Teste antes:** rodar `npm test --prefix server`. Verificar que em `NODE_ENV=production` um erro 500 retorna `{ error: "Internal Server Error" }` sem detalhes internos.
- **Pronto quando:** o helper existe, está registrado, e pelo menos os arquivos de maior risco (students, sessions, requireStudent) usam `next(err)`. `npm test --prefix server` passa.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3. Sugerir `git add .` e `git commit -m "feat(sec): add centralized errorHandler, hide err.message in prod (T-099)"`.
- **Commit:** `feat(sec): add centralized errorHandler, hide err.message in prod (T-099)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-099.`

---

### T-100 · Instalar e configurar helmet no servidor Express (SEC-04)
**P · Origem:** Auditoria de segurança M-37/SEC-04 · **Ler:** ENG
- **Objetivo:** Adicionar o middleware `helmet` ao servidor Express para configurar automaticamente os HTTP security headers essenciais (CSP, X-Frame-Options, HSTS, X-Content-Type-Options, XSS-Protection).
- **Back:**
  1. Instalar: `npm install helmet --prefix server`.
  2. Em `server/src/index.js`, adicionar `const helmet = require('helmet');` e `app.use(helmet());` como **primeira** chamada de middleware, antes de `cors()` e `express.json()`.
  3. Verificar que o CORS ainda funciona corretamente com `helmet` ativo (podem ser necessários ajustes no `Content-Security-Policy` para o frontend em `localhost:5173`).
- **Front:** sem impacto direto. Verificar que o frontend não recebe bloqueios inesperados do CSP ao acessar a API.
- **Teste antes:** rodar o servidor e fazer `curl -I http://localhost:3001/api/health`. Verificar ausência dos headers de segurança. Após a instalação, confirmar presença de `X-Frame-Options`, `X-Content-Type-Options` e `X-XSS-Protection` na resposta.
- **Pronto quando:** `app.use(helmet())` está presente no `index.js` como primeiro middleware. `npm test --prefix server` passa. Headers de segurança aparecem nas respostas.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3. Sugerir `git add .` e `git commit -m "feat(sec): add helmet middleware for HTTP security headers (T-100)"`.
- **Commit:** `feat(sec): add helmet middleware for HTTP security headers (T-100)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-100.`

---

### T-101 · Remover console.log que vaza dados de infraestrutura no startup (SEC-03)
**P · Origem:** Auditoria de segurança M-37/SEC-03 · **Ler:** ENG
- **Objetivo:** Remover ou substituir o `console.log` do startup que imprime `DB_NAME@DB_HOST:DB_PORT` nos logs do servidor, prevenindo vazamento de dados de infraestrutura.
- **Back:** Em `server/src/index.js` linha 44, substituir:
  ```js
  console.log(`   DB: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
  ```
  por:
  ```js
  console.log(`   DB: connected`);
  ```
  Verificar se existem outros `console.log` em `server/src/db/connection.js` ou em scripts de migração que exponham variáveis sensíveis (DB_PASSWORD, DB_USER) — substituí-los por mensagens genéricas.
- **Front:** sem impacto.
- **Teste antes:** rodar `node server/src/index.js` (ou `npm run dev --prefix server`) e verificar que o output do terminal **não** contém o nome do banco, host ou porta de conexão.
- **Pronto quando:** nenhum `console.log` no código de aplicação (fora de scripts de migração/seed) exibe valores de variáveis `DB_*` ou `PORT` explicitamente. `npm test --prefix server` passa.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3. Sugerir `git add .` e `git commit -m "fix(sec): remove infrastructure info from startup logs (T-101)"`.
- **Commit:** `fix(sec): remove infrastructure info from startup logs (T-101)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-101.`

---

### T-102 · Instalar e configurar express-rate-limit nas rotas críticas (SEC-05)
**P · Origem:** Auditoria de segurança M-39/SEC-05 · **Ler:** ENG
- **Objetivo:** Adicionar o middleware `express-rate-limit` para proteger rotas críticas (criação de estudantes, reviews e fila) contra abuso ou loops acidentais no frontend.
- **Back:** 
  1. Instalar: `npm install express-rate-limit --prefix server`.
  2. Em `server/src/index.js`, configurar um limitador global moderado (ex: 500 req/min) após o `helmet`.
  3. Criar limitadores restritos em middlewares (ex: 30 req/min) e aplicar nas rotas: `POST /api/students`, `POST /api/reviews`, `GET /api/reviews/queue`.
- **Front:** sem impacto direto, a não ser que os testes revelem falha. O frontend deve lidar com 429 adequadamente se atingir o limite (o interceptor axios deve logar ou mostrar erro).
- **Teste antes:** Tentar disparar 100 requisições seguidas para `POST /api/reviews` no mock test, confirmar que o servidor aceita. Após implementar, confirmar que devolve HTTP 429 Too Many Requests.
- **Pronto quando:** O pacote `express-rate-limit` estiver operante e testes da API continuarem passando sob uso normal.
- **Pausa:** seguir protocolo em [`RETOMAR.md`](./RETOMAR.md) §3. Sugerir `git add . && git commit -m "feat(sec): add express-rate-limit to protect critical routes (T-102)"`.
- **Commit:** `feat(sec): add express-rate-limit to protect critical routes (T-102)`.
- **Prompt:** `Leia plano-de-acao/RETOMAR.md e execute a T-102.`
