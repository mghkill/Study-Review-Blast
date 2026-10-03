# Mapa V1 → V2

> Correspondência entre as tarefas do Plano V1 (`legado/PLANO-v1.md`) e as tarefas do Plano V2 (`PLANO.md`).
> Legenda: ✅ já feita (commitada) · ♻️ reaproveitada/refatorada · 🆕 tarefa nova sem equivalente no V1 · 🗑️ substituída/removida

---

## Fase 0 do V1 → Fase 1 do V2 (Reconhecimento e rede de segurança)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-001 | Ler package.json, schema, rotas, confirmar versões | T-001 | Abrir o V2: branch `v2/phase-01-safety-net` | ♻️ (reconhecimento refeito do zero; branch é nova) |
| T-002 | Descobrir como estudante chega à API | — | — | ✅ incorporado no legado (conhecimento registrado) |
| T-003 | Confirmar `npm run dev` | T-003 | Baseline de qualidade | ♻️ |
| T-004 | Criar branch de trabalho | T-001 | Abrir o V2 (branch) | ♻️ |
| T-005 | Backup `pg_dump -Fc` | T-002 | Backup novo e teste de restauração | ♻️ (V2 exige teste de restauração com contagem) |
| T-006 | Baseline de testes e lint | T-003 | Baseline de qualidade | ♻️ |
| T-007 | Perguntar D-02 e D-03 ao usuário | — | — | ✅ incorporado nas decisões D-02/D-03 do PLANO.md V2 |
| — | — | T-004 | Matriz de usabilidade | 🆕 (antecipação de v1 T-060) |

---

## Fase 1 do V1 → Fase 4 do V2 (Migrações versionadas)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-010 | Criar `migrations/` e `schema_migrations` | T-016 | (concluída no legado) | ✅ |
| T-011 | Executor Node puro | T-016 | (concluída no legado) | ✅ |
| T-012 | `001_baseline.sql` e `npm run migrate` | T-016 | (concluída no legado) | ✅ |
| T-013 | Testar migrations em banco novo e cópia | T-016 | (concluída no legado) | ✅ |
| — | — | T-018 | Migrador com checksum | 🆕 |
| — | — | T-019 | Limpeza de scripts soltos | 🆕 |
| T-044 | `set_updated_at()` e gatilhos | T-020 | `updated_at` automático | ♻️ |
| T-045 | Índices nas FKs | T-021 | Índices | ♻️ |
| T-046 | Revisar `ON DELETE` | T-022 | `ON DELETE` e excluir contexto | ♻️ |
| T-047 | `docs/modelo-de-dados.md` | T-023 | Documento do modelo de dados | ♻️ |
| T-048 | Rodar migrations em banco vazio | T-024 | Prova das migrações | ♻️ |

---

## Fase 2 do V1 → Fase 8 do V2 (Isolamento por estudante)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-020 | Mapear rotas sem filtro | T-050 | (concluída no legado) | ✅ |
| T-021 | Testes de isolamento (falham antes) | T-050 | (concluída no legado) | ✅ |
| T-022 | Migration 002: `vocabulary_items.student_id` | T-050 | (concluída no legado) | ✅ |
| T-023 | Migration 003: migrar dados existentes | T-050 | (concluída no legado) | ✅ |
| T-024 | Migration 004: FKs compostas | T-050 | (concluída no legado) | ✅ |
| T-025 | Middleware `requireStudent` | T-050 | (concluída no legado) | ✅ |
| T-026 | `POST /api/students` sem vincular vocab | T-050 | (concluída no legado) | ✅ |
| T-027 | Cliente: `X-Student-Id` em `api.js` | T-050 | (concluída no legado) | ✅ |
| T-028 | Conferir telas com isolamento | T-050 | (concluída no legado) | ✅ |
| T-029 | Testes passando + sem regressão | T-050 | (concluída no legado) | ✅ |
| T-030 | Documentar limitação de segurança | T-050 | (concluída no legado) | ✅ |
| — | — | T-051 | Recertificação automática pós-ORM/TS | 🆕 |
| — | — | T-052 | Trocar de estudante pela Sidebar | 🆕 |
| — | — | T-053 | Estados vazios e pacote inicial | 🆕 |

---

## Fase 3 do V1 → Fase 4 do V2 (Modelo lógico completo)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-040 | Tabela `tenses` + FK | T-017 | (concluída no legado — migrations 006-009) | ✅ |
| T-041 | CHECKs de `session_type` e `source` | T-017 | (concluída no legado) | ✅ |
| T-042 | `custom_quizzes` + `custom_quiz_questions` | T-017 | (concluída no legado) | ✅ |
| T-043 | `language_code` em `vocabulary_items` | T-017 | (concluída no legado) | ✅ |

---

## Fase 4 do V1 → Fase 10 do V2 (Gerador de frases)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-050 | `sentenceGenerator.js` | T-072 | Gerador por tempo verbal | ♻️ |
| T-051 | Testes do gerador | T-072 | (incluído no cartão) | ♻️ |
| T-052 | `POST /api/sentences/generate` | T-073 | Endpoint de geração | ♻️ |
| T-053 | Interface: botão "Gerar frases" | T-074 | "Gerar frases" na interface | ♻️ |
| T-054 | Documentar limites do gerador | T-074 | (incluído no cartão) | ♻️ |

---

## Fase 5 do V1 → Fase 1 e 10 do V2 (Conferência das funcionalidades)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-060 | Matriz de cobertura | T-004 | Matriz de usabilidade | ♻️ (antecipada para Fase 1 do V2) |
| T-061 | `add-feature` para cada ❌/⚠️ | T-078 | Revisar a matriz de usabilidade | ♻️ |

---

## Fase 6 do V1 → Fases 2, 6, 7 do V2 (Qualidade)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-070 | Testes SRS + `docs/algoritmo-srs.md` | T-077 | Aposentar fluxo antigo + `docs/srs-algorithm.md` | ♻️ (agora FSRS substitui o SRS próprio) |
| T-071 | Erros da API em JSON | T-042 | Tratamento central de erros + Toast | ♻️ |
| T-072 | Validação de entrada | T-043–T-045 | Zod em todos os endpoints | ♻️ (com Zod, da lista D-10) |
| T-073 | Suíte completa verde | T-084 | Metas de cobertura | ♻️ |

---

## Fase 7 do V1 → Fases 2 e 13 do V2 (Open source)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-080 | `LICENSE` | T-087 | LICENSE e arquivos de comunidade | ♻️ |
| T-081 | `CONTRIBUTING.md` | T-087 | (incluído) | ♻️ |
| T-082 | `.gitignore` e `.env.example` | T-089 | Segredos e dados pessoais | ♻️ |
| T-083 | Verificar `.env` no histórico git | T-089 | (incluído) | ♻️ |
| T-084 | Seeds neutros | T-089 | (incluído) | ♻️ |
| T-085 | Atualizar README | T-091 | README final (pt-BR) | ♻️ |
| T-086 | Conferir links do README | T-091 | (incluído) | ♻️ |
| T-087 | (opcional) CODE_OF_CONDUCT, SECURITY | T-087 | (incluído como obrigatório no V2) | ♻️ |

---

## Fase final do V1 → Fase 14 do V2 (Prova de fogo)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-090 | Seguir o README do zero em banco vazio | T-092 | Seguir o README como um estranho | ♻️ |

---

## Tarefas 100% novas no V2 (sem equivalente no V1)

| V2 | Título | Fase |
|---|---|---|
| T-005–T-011 | Ferramentas de qualidade (root package.json, ESLint, Prettier, Husky, commitlint, CI, Dependabot) | 2 |
| T-012–T-015 | Ambiente reproduzível (banco de testes, Zod env, Docker, `npm run dev` único) | 3 |
| T-018–T-019 | Migrador com checksum, limpeza de scripts soltos | 4 |
| T-025–T-026 | ORM (Drizzle ou Prisma — D-05) e drift check | 5 |
| T-027–T-035 | Camada de repositórios (ORM) para todas as rotas | 5 |
| T-036–T-041 | TypeScript incremental (server e client) | 6 |
| T-046–T-049 | helmet, rate-limit, pino, npm audit | 7 |
| T-051–T-053 | Recertificação de isolamento, trocar de estudante, estados vazios | 8 |
| T-054–T-063 | Tradução para inglês + i18n completo | 9 |
| T-064–T-081 | FSRS, quiz Anki, quizzes persistidos, parágrafos, voz | 10–11 |
| T-082–T-085 | Playwright E2E e cobertura | 12 |
| T-086–T-090 | OpenAPI, comunidade, screenshots | 13 |
| T-093–T-094 | README em inglês e planejamento em inglês | 15 |
