# Convenções do Plano V2 — StudyReviewBlast

> Referência rápida para a IA durante a execução. Abreviação usada nos cartões de tarefa: **CONV**.

---

## §1 — Qualidade e ferramentas (Fase 2)

- `package.json` na **raiz** é só para ferramentas; `private: true`; sem dependências de runtime.
- Scripts da raiz delegam para server/client com `npm --prefix`:
  ```json
  "test":  "npm test --prefix server && npm run test:run --prefix client",
  "lint":  "npm run lint --prefix server && npm run lint --prefix client"
  ```
- **ESLint** no server: flat config (`eslint.config.js`), `@eslint/js` recommended, `globals.node` + `globals.jest`.
- **Oxlint** no client: mantido como está. Não adicionar ESLint ao client.
- **Prettier**: um único `.prettierrc` na raiz; `.prettierignore` exclui `node_modules`, `dist`, `plano-de-acao/`, `skills/`.
- **Husky** + **lint-staged**: instalados na raiz; hook `pre-commit` roda lint-staged; arquivos `.js`/`.ts`/`.jsx`/`.tsx`/`.json` passam pelo Prettier.
- **commitlint**: hook `commit-msg`; padrão `@commitlint/config-conventional`; mensagens em inglês.
- **`.git-blame-ignore-revs`**: o commit de formatação geral do Prettier vai para este arquivo.
- **GitHub Actions** (CI): arquivo `.github/workflows/ci.yml`; jobs: lint (server + client), test-server (PostgreSQL 18 como serviço), test-client + build.
- **Dependabot**: `.github/dependabot.yml`; npm + actions; semanal; agrupado.

---

## §2 — Commits e branches

- Uma **branch por fase**: `v2/phase-NN-slug` (ex.: `v2/phase-01-safety-net`).
- Mensagens de commit em **inglês**, Conventional Commits:
  - `feat(escopo): descrição (T-0XX)`
  - `fix(escopo): descrição (T-0XX)`
  - `chore(escopo): descrição (T-0XX)`
  - `docs: descrição (T-0XX)`
  - `build(escopo): descrição (T-0XX)`
  - `test(escopo): descrição (T-0XX)`
  - `refactor(escopo): descrição (T-0XX)`
- **`git add .` sempre na raiz** do repositório.
- A IA **não faz push**. O desenvolvedor faz push e abre PR ao fim de cada fase.

---

## §3 — Banco de dados e migrações

- Migração aplicada **nunca é editada**; cria-se a próxima.
- Backup (`pg_dump -Fc`) em `C:\Users\opera\studyreviewblast-backups\` antes de qualquer migração destrutiva.
- Banco de testes: `<DB_NAME>_test`; criado e migrado pelo `globalSetup` do Jest; nunca tocado em desenvolvimento.
- Arquivo de migração: `server/src/db/migrations/NNN_slug.sql` (número com 3 dígitos, incremental).
- Cada migration roda em transação; a tabela `schema_migrations` registra `(version, name, applied_at)`.

---

## §4 — TypeScript (Fase 6 em diante)

- `tsconfig.json` com `allowJs: true` inicialmente (migração incremental); `strict: true` ao fim da Fase 6.
- Arquivos novos nascem em `.ts` / `.tsx`; arquivos existentes são convertidos um a um.
- Server: `tsx` para dev; `tsc` para typecheck no CI.
- Client: `vite` já suporta TS nativamente; basta renomear `.js` → `.ts`.
- **`DB_PASSWORD` e demais segredos** validados com Zod ao inicializar; erro fatal com mensagem clara se faltar.

---

## §5 — Código e nomenclatura

- Todo código **novo** (nomes de variáveis, funções, arquivos, comentários, mensagens de API) em **inglês**.
- Código PT existente é traduzido na Fase 9 (T-054–T-063).
- Exceção permanente: pasta `plano-de-acao/`, `skills/` e `LINHA-DO-TEMPO.md` ficam em PT até a Fase 15.
- Nomes de arquivo: `kebab-case` para routes/middleware/services; `PascalCase` para componentes React.
- SQL concatenado por string é proibido a partir da T-035 (regra de lint).

---

## §6 — Segurança (Fase 7)

- `helmet()` antes de todas as rotas; CORS restrito por `ALLOWED_ORIGIN` do `.env`.
- Rate limit: `express-rate-limit`; limites mais rígidos em endpoints de escrita.
- Logs: `pino` + `pino-http`; request ID injetado; `redact` de campos sensíveis; nunca logar senha.
- `npm audit --omit=dev` no CI; falha com severidade high ou critical sem justificativa em `audit-resolve.json`.

---

## §7 — Testes

- Teste escrito **antes** da implementação; visto falhando; só então implementa.
- Backend: Jest + Supertest; arquivo `*.test.js` (ou `.test.ts`) em `server/tests/`.
- Frontend: Vitest + Testing Library; arquivos em `client/src/test/`.
- E2E (Fase 12): Playwright; arquivos em `e2e/`; usa banco de teste.
- Meta de cobertura (T-084): statements ≥ 80% no server; branches ≥ 70%.

---

## §8 — Ambiente (referência rápida)

```powershell
# Rodar o servidor (porta 3001)
cd server && npm run dev

# Rodar o cliente (porta 5173)
cd client && npm run dev

# Migrations
npm run migrate --prefix server

# Testes backend
npm test --prefix server

# Testes frontend
npm run test:run --prefix client

# Lint frontend
npm run lint --prefix client

# Status do plano
py plano-de-acao/plan_tool.py status
```
