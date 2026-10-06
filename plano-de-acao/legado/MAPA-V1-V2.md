# Mapa V1 → V2

> Correspondência entre as tarefas do Plano V1 (`legado/PLANO-v1.md`) e as tarefas do Plano V2 (`PLANO.md`).
> Legenda: ✅ já feita (commitada) · ♻️ reaproveitada/refatorada · 🆕 tarefa nova sem equivalente no V1 · 🗑️ substituída/removida

---

## Fase 0 do V1 → Fase 1 do V2 (Reconhecimento e rede de segurança)

| V1 | Título V1 | V2 | Título V2 | Status |
|---|---|---|---|---|
| T-001 | Ler package.json, schema, rotas, confirmar versões | — | — | ✅ incorporado na LINHA-DO-TEMPO L6-8 |
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

Lista exata das 63 tarefas do V2 que não possuem correspondência direta no Plano V1 e não foram listadas nas seções anteriores:

| V2 | Título | Fase |
|---|---|---|
| T-005 | `package.json` na raiz só para ferramentas, com `npm test` e `npm run lint` delegando para server e client (D-09) | Fase 2 |
| T-006 | ESLint 9 (flat config) no server; client mantém Oxlint (D-17) | Fase 2 |
| T-007 | Prettier compartilhado + formatação geral em commit separado + `.git-blame-ignore-revs` | Fase 2 |
| T-008 | Husky + lint-staged na raiz + guarda contra commit parcial | Fase 2 |
| T-009 | commitlint (Conventional Commits) no hook `commit-msg` | Fase 2 |
| T-010 | GitHub Actions: lint + testes do server (PostgreSQL 18 de serviço) + testes e build do client | Fase 2 |
| T-011 | Dependabot (npm e actions, semanal, agrupado) + CodeQL | Fase 2 |
| T-012 | Banco de testes separado (`<DB_NAME>_test`), criado e migrado pelo setup do Jest; remover `server/clean_test_db.js` (D-12) | Fase 3 |
| T-013 | Validação do `.env` com Zod e `.env` único na raiz; banner "servidor indisponível" no client | Fase 3 |
| T-014 | `docker-compose.yml` só com PostgreSQL 18 + scripts `db:up`/`db:down` (D-11) | Fase 3 |
| T-015 | `npm run dev` único na raiz (concurrently) + `npm run setup` (D-09) | Fase 3 |
| T-025 | ADR `docs/adr/0001-orm.md` + instalar ORM + introspecção do banco + cliente compartilhando o pool | Fase 5 |
| T-026 | Verificação de drift do schema do ORM (`npm run db:check-drift`) + passo no CI | Fase 5 |
| T-027 | Camada de repositórios com escopo por estudante; migrar rotas `students` e `tenses` | Fase 5 |
| T-028 | Migrar rotas `sessions` para o ORM | Fase 5 |
| T-029 | Migrar rota `dashboard` (agregações parametrizadas) | Fase 5 |
| T-030 | Migrar rotas `sentences` e `paragraphs` | Fase 5 |
| T-031 | Migrar `vocabulary` — leitura (lista e detalhe) | Fase 5 |
| T-032 | Migrar `vocabulary` — escrita (criar, editar, excluir, frases, contextos, significados) com transação | Fase 5 |
| T-033 | Migrar `reviews` — fila de revisão | Fase 5 |
| T-034 | Migrar `reviews` — registrar revisão, histórico, erros, frase do aluno | Fase 5 |
| T-035 | Migrar `seed.js`; regra de lint que proíbe SQL montado por concatenação; `db.query` só no migrador | Fase 5 |
| T-036 | Base TypeScript no server (`tsconfig` com allowJs, `typecheck`, CI) e ajuste do conteúdo do script `dev` | Fase 6 |
| T-037 | Converter `config`, `middleware` e `services` do server para TS | Fase 6 |
| T-038 | Converter rotas e repositórios `students`, `tenses`, `sessions`, `dashboard` | Fase 6 |
| T-039 | Converter rotas e repositórios `sentences` e `vocabulary` | Fase 6 |
| T-040 | Converter `reviews` e `index`; desligar allowJs no server; `strict` | Fase 6 |
| T-041 | Base TypeScript no client (`typecheck`), `api.js` → `api.ts` com tipos; arquivos novos em TS | Fase 6 |
| T-046 | helmet + CORS restrito por variável de ambiente + limite de tamanho do corpo | Fase 7 |
| T-047 | Rate limit (mais rígido em escrita) + mensagem amigável para 429 | Fase 7 |
| T-048 | Logs com pino/pino-http (request id, redação de segredos); request id no Toast de erro 500 | Fase 7 |
| T-049 | `npm audit` (corrigir sem breaking) + passo no CI + atualizar documento de segurança | Fase 7 |
| T-054 | Inventário de português (`docs/translation-inventory.md`) gerado por script somente leitura | Fase 9 |
| T-055 | i18next + react-i18next + detector; locales `en` e `pt-BR`; seletor de idioma na Sidebar (D-15) | Fase 9 |
| T-056 | Extrair textos: StudentSelect, Sidebar, UI, App | Fase 9 |
| T-057 | Extrair textos: Dashboard e Progresso | Fase 9 |
| T-058 | Extrair textos: Vocabulário, Detalhes da Palavra, Novo Verbo | Fase 9 |
| T-059 | Extrair textos: StudySession parte 1 (escolha de modo e quiz personalizado) | Fase 9 |
| T-060 | Extrair textos: StudySession parte 2 (cartão e avaliação) + Frases, Parágrafos, Busca | Fase 9 |
| T-061 | Server em inglês: mensagens da API e comentários; client traduz erros pelo `code` | Fase 9 |
| T-062 | Testes, seed, scripts e utils em inglês (sem editar migrações aplicadas) | Fase 9 |
| T-063 | Nomes de arquivos em inglês + links + guarda no CI contra português no código | Fase 9 |
| T-064 | ADR `docs/adr/0002-fsrs.md` + migração do estado FSRS e `review_logs` com backfill (D-14) | Fase 10 |
| T-065 | Serviço `scheduler` com ts-fsrs (avaliar e prévia de intervalos) + testes | Fase 10 |
| T-066 | API de estudo: `GET /api/study/queue` e `POST /api/study/answer` (nota 1–4) | Fase 10 |
| T-067 | Cartão de quiz estilo Anki (Again/Hard/Good/Easy com prévia e atalhos) como fluxo padrão de "Estudar Agora" | Fase 10 |
| T-068 | Tipos de cartão a partir dos dados existentes (significado, lacuna com frases, contextos, formas verbais) | Fase 10 |
| T-069 | API de quizzes personalizados persistidos (`/api/quizzes`) usando as tabelas do v1 T-042 | Fase 10 |
| T-070 | Tela "Meus quizzes": criar bloco de 5/10, editar, jogar e ver resultado | Fase 10 |
| T-071 | Prática com parágrafos: leitura + lacunas nas palavras ligadas, avaliada como revisão | Fase 10 |
| T-075 | API de estatísticas de aprendizado (retenção, revisões por dia, previsão, sequência) | Fase 10 |
| T-076 | Dashboard de aprendizado: retenção, heatmap de 365 dias, revisões por dia, previsão | Fase 10 |
| T-079 | Hook `useSpeech` + preferências de voz (voz, sotaque, velocidade) salvas | Fase 11 |
| T-080 | Reconhecimento de fala com detecção de suporte + pontuação de pronúncia (função pura) (D-18) | Fase 11 |
| T-081 | Gravar prática de pronúncia (`pronunciation_practice`) + botão "Falar" no cartão + tendência no Progresso | Fase 11 |
| T-082 | Playwright: configuração com banco de teste + teste de fumaça (criar estudante, adicionar palavra) | Fase 12 |
| T-083 | E2E: fluxo de estudo e isolamento entre estudantes | Fase 12 |
| T-085 | E2E no CI com relatório como artefato | Fase 12 |
| T-086 | OpenAPI gerado dos schemas Zod + Swagger UI em `/api/docs` (fora de produção) | Fase 13 |
| T-088 | Modelos de issue e PR em `.github/` + `CHANGELOG.md` [v1 T-087] | Fase 13 |
| T-090 | Capturas de tela automáticas (Playwright) em `docs/images/` | Fase 13 |
| T-093 | README em inglês + `README.pt-BR.md` com links cruzados (D-08) | Fase 15 |
| T-094 | Planejamento em inglês: renomear `plano-de-acao/` e arquivos, ajustar `plan_tool.py`, skills em inglês (D-16) | Fase 15 |
