# Plano de Ação V2 — StudyReviewBlast

> **Lista operacional (fonte da verdade do progresso).** O detalhe de cada tarefa (objetivo, back, front, teste antes, pronto, prompt) está em [`TAREFAS.md`](./TAREFAS.md). O passo a passo diário está em [`RETOMAR.md`](./RETOMAR.md). A explicação para humanos está no [`README.md`](../README.md).
>
> Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` feita · `[!]` bloqueada
> Comandos: `py plano-de-acao/plan_tool.py status` · `start T-000` · `done T-000 --nota "..."` · `block T-000 "motivo"` · `log "mensagem"` · `add-feature "Título" --task "..."`
> Tamanho: **[P]** pequena (até ~30 min) · **[M]** média (uma sessão). Tarefa grande é proibida: divide-se.
> O plano V1 (T-001 a T-090 antigos) está congelado em [`legado/PLANO-v1.md`](./legado/PLANO-v1.md); o mapa antigo → novo está em [`legado/MAPA-V1-V2.md`](./legado/MAPA-V1-V2.md). Referências como "v1 T-044" apontam para o legado.
> **Nunca escreva senhas, tokens ou o conteúdo do `.env` neste plano.**

## PRÓXIMO PASSO
<!-- proximo:start -->
- Atualizado em 2026-10-06 17:50
- Iniciar **T-100** — [P] Instalar e configurar helmet para headers de segurança HTTP (SEC-04)
<!-- proximo:end -->

## Regras fixas (só mudam se o usuário pedir)
- Banco **PostgreSQL 18**; backend **Node + Express**; frontend **React + Vite**. Não trocar nada disso.
- `npm run dev` em `server/` (porta **3001**) e em `client/` (porta **5173**) continua funcionando; não mudar portas nem o proxy do Vite. Exceções só por decisão (D-07 conteúdo do script com TypeScript; D-09 `dev` único na raiz, sem remover os atuais).
- **Uma tarefa por sessão** e **pausa obrigatória** no fim de cada uma (protocolo em `RETOMAR.md`). `git add .` sempre **na raiz** do repositório. A IA não faz `push`.
- **Teste escrito antes** da implementação e visto falhando. Toda tarefa diz o que muda no **front** (ou justifica "sem impacto").
- **Nada pago** (IA paga, TTS premium, hospedagem, Sentry etc.). Ideias pagas vão para "Melhorias pós-prova de fogo" no README.
- Dependência nova só se estiver na lista aprovada em **D-10**; fora dela, nova decisão.
- Todo código, comentário, nome de arquivo e commit **novo** nasce em **inglês** (commits em Conventional Commits). O que já existe em português é traduzido na Fase 9. Exceção: a pasta `plano-de-acao/` e `skills/` ficam em português até a Fase 15.
- Migração já aplicada nunca é editada; cria-se a próxima. Backup antes de migração destrutiva.

## Decisões
Explicação em linguagem simples no README (seção "Decisões explicadas").

| ID | Decisão | Padrão adotado (recomendação) | Alternativas | Situação |
|---|---|---|---|---|
| D-01 | Posse dos dados | Cada palavra (e significados, contextos, frases) pertence a **um** estudante | Catálogo global + vínculo | Decidido (v1, migrations 002–004) |
| D-02 | Dados atuais do banco | **Preservar** o banco de desenvolvimento; backup antes de cada fase com migração; testes em banco separado (D-12) | Descartar e recriar com seed | Decidido (confirmado em 2026-10-03) |
| D-03 | Licença e autor | **MIT**, `Copyright (c) 2026 mghkill` (trocar pelo nome que você quiser público) | Apache-2.0, GPL-3.0 | Decidido (confirmado em 2026-10-03) |
| D-04 | Como a API sabe quem é o estudante sem login | Cabeçalho `X-Student-Id` validado pelo middleware `requireStudent` (já existe) | Login (pós-prova de fogo); RLS no PostgreSQL | Decidido (v1); confirmar manutenção |
| D-05 | ORM | **Drizzle ORM** (+ drizzle-kit só para introspecção) | Prisma (sua sugestão inicial); continuar com `pg` puro | Decidido (confirmado em 2026-10-03) |
| D-06 | Quem manda no schema | **Migrações SQL próprias continuam a fonte da verdade**; o schema do ORM é gerado por introspecção e conferido no CI (drift) | Migrações do ORM (`drizzle-kit migrate` / `prisma migrate`) | Decidido (confirmado em 2026-10-03) |
| D-07 | TypeScript (quando e como) | **Incremental, logo após o ORM (Fase 6)**: server primeiro; no client, `api.ts` e todo arquivo novo/reescrito em TS. Permite mudar o *conteúdo* do script `dev` do server mantendo nome e porta | Não adotar (JSDoc); converter tudo de uma vez; deixar para o fim | Decidido (confirmado em 2026-10-03) |
| D-08 | Idioma do README | **pt-BR até a Fase 14** (com resumo em inglês no topo); na Fase 15 vira inglês e o pt-BR fica em `README.pt-BR.md` | Inglês desde já | Decidido (confirmado em 2026-10-03) |
| D-09 | `package.json` na raiz | Criar só para ferramentas (lint, testes, hooks) e um `npm run dev` único com `concurrently`, **sem remover** os scripts de `server/` e `client/` | Não criar; npm workspaces | Decidido (confirmado em 2026-10-03) |
| D-10 | Dependências gratuitas aprovadas | Lista "Dependências aprovadas" abaixo | Aprovar uma a uma | Decidido (confirmado em 2026-10-03) |
| D-11 | Docker (ambiente) | **Docker Desktop já instalado e rodando** (v29.5.2 / Compose v5.1.3). T-014 usa Docker opcional em porta alternativa (`5433:5432`) sem quebrar PostgreSQL local; README e CI rodam também sem Docker; nenhuma outra T depende dele | PostgreSQL local exclusivo | Decidido (2026-10-03) |
| D-12 | Banco de testes | Testes usam **banco próprio separado** (`<DB_NAME>_test`) e nunca o de desenvolvimento | Continuar testando no banco de desenvolvimento | Decidido (2026-10-03) |
| D-13 | Branches e PRs | **Uma branch por fase** (`v2/phase-NN-slug`); no fim da fase o usuário faz push, abre PR e faz merge | Tudo em `main`; uma branch para o V2 inteiro | Decidido (2026-10-03) |
| D-14 | Algoritmo de revisão | **FSRS** (`ts-fsrs`) decide *quando* revisar; botões Again/Hard/Good/Easy com prévia; prioridade por erros ordena os vencidos | Manter o SRS próprio; SM-2 | Decidido (2026-10-03) |
| D-15 | Idioma padrão da interface | Detectar o idioma do navegador; **padrão `en`**; seletor `en`/`pt-BR` persistido no navegador | Padrão `pt-BR` | Decidido (2026-10-03) |
| D-16 | Planejamento em inglês | Tradução do planejamento é **OPCIONAL**, realizada apenas após a T-092 (prova de fogo) e **sem renomear a pasta `plano-de-acao/`** | Renomear pastas e arquivos | Decidido (2026-10-03) |
| D-17 | Lint do client | Manter **Oxlint** no client (já configurado); **ESLint** no server; **Prettier** nos dois | ESLint também no client | Decidido (2026-10-03) |
| D-18 | Voz e reconhecimento | Web Speech API (`SpeechRecognition`), opcional, desligado por padrão, aviso do Chrome/Google, "100% local por padrão"; preferir vozes com `localService=true`; **comparação entre falado e esperado** (sem análise fonética) | Não ter reconhecimento | Decidido (2026-10-03) |
| D-19 | Idioma Técnico | Todo código, arquivos fonte, nomes de pastas, commits e comentários de código devem ser estritamente em **Inglês** (exceto para dados didáticos específicos do app). | Permitir mistura PT/EN | Decidido (2026-10-06) |

### Dependências aprovadas (D-10) — todas gratuitas e de código aberto
| Fase | Pacotes | Para quê |
|---|---|---|
| 2 | `eslint`, `@eslint/js`, `globals`, `prettier`, `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional` | Lint, formatação, hooks de commit, padrão de mensagens |
| 3 | `zod`, `concurrently` | Validar `.env`; `npm run dev` único na raiz |
| 5 | `drizzle-orm`, `drizzle-kit` | ORM e introspecção |
| 6 | `typescript`, `tsx`, `@types/node`, `@types/express`, `@types/cors`, `@types/pg`, `typescript-eslint`, `@types/jest`, `@types/supertest`, `ts-jest` | TypeScript no server/client e tipagem completa de testes |
| 7 | `helmet`, `express-rate-limit`, `pino`, `pino-http`, `pino-pretty` (dev) | Segurança HTTP e logs |
| 9 | `i18next`, `react-i18next`, `i18next-browser-languagedetector` | Interface bilíngue em `en` e `pt-BR` |
| 10 | `ts-fsrs` | Repetição espaçada FSRS (heatmap em SVG/CSS nativo, sem biblioteca) |
| 12 | `@playwright/test`, `@vitest/coverage-v8` | Testes de ponta a ponta e cobertura de código |
| 13 | `@asteasolutions/zod-to-openapi`, `swagger-ui-express` | Documentação interativa da API (OpenAPI/Swagger) |

## Fase 1 — Reconhecimento e rede de segurança
- [x] T-001 [P] Abrir o V2: árvore limpa em `main` e branch `v2/phase-01-safety-net` ✔ 2026-10-03 20:11
- [x] T-002 [P] Backup novo do banco (`pg_dump -Fc`) fora do repositório + restauração de teste com contagem por tabela ✔ 2026-10-05 20:25
- [x] T-003 [P] Baseline: testes, lint, `npm audit` e smoke das telas; registrar números ✔ 2026-10-05 20:39
- [x] T-004 [M] Matriz de usabilidade `docs/usability-matrix.md` (tela × rota × tabela × teste; dados que existem no banco e não aparecem no front) [v1 T-060] ✔ 2026-10-05 21:06

## Fase 1.5 — Hotfixes de Segurança (Security First)
- [x] T-095 [P] Parametrizar LIMIT e OFFSET e criar sanitizador de erros na API sem vazar err.message nem SQL ✔ 2026-10-06 15:48
- [x] T-098 [P] Sanitizar LIMIT interpolado em reviews.js (SEC-01) ✔ 2026-10-06 17:46
- [x] T-099 [P] Remover vazamento de err.message genérico em 35 rotas (SEC-02) ✔ 2026-10-06 17:50
- [ ] T-100 [P] Instalar e configurar helmet para headers de segurança HTTP (SEC-04)
- [ ] T-101 [P] Remover console.log que vaza dados de infraestrutura no startup (SEC-03)
- [ ] T-102 [P] Instalar e configurar express-rate-limit nas rotas críticas (SEC-05)

## Fase 2 — Qualidade e ferramentas base
- [ ] T-005 [P] `package.json` na raiz só para ferramentas, com `npm test` e `npm run lint` delegando para server e client (D-09)
- [ ] T-006 [M] ESLint 9 (flat config) no server; client mantém Oxlint (D-17)
- [ ] T-007 [M] Prettier compartilhado + formatação geral em commit separado + `.git-blame-ignore-revs`
- [ ] T-008 [M] Husky + lint-staged na raiz + guarda contra commit parcial
- [ ] T-009 [P] commitlint (Conventional Commits) no hook `commit-msg`
- [ ] T-010 [M] GitHub Actions: lint + testes do server (PostgreSQL 18 de serviço) + testes e build do client
- [ ] T-011 [P] Dependabot (npm e actions, semanal, agrupado) + CodeQL

## Fase 3 — Ambiente reproduzível
- [ ] T-012 [M] Banco de testes separado (`<DB_NAME>_test`), criado e migrado pelo setup do Jest; remover `server/clean_test_db.js` (D-12)
- [ ] T-013 [M] Validação do `.env` com Zod e `.env` único na raiz; banner "servidor indisponível" no client
- [ ] T-014 [P] `docker-compose.yml` só com PostgreSQL 18 + scripts `db:up`/`db:down` (D-11)
- [ ] T-015 [P] `npm run dev` único na raiz (concurrently) + `npm run setup` (D-09)

## Fase 4 — Migrações versionadas e modelo lógico (SQL)
- [x] T-016 Migrações versionadas: executor em Node, `schema_migrations`, baseline 001 e migrations 002–005 [v1 T-010–T-013] ✔ legado 2026-10-01
- [x] T-017 Modelo lógico parte 1: `tenses`, CHECKs, `custom_quizzes`, `language_code` (migrations 006–009) [v1 T-040–T-043] ✔ legado 2026-10-02
- [ ] T-018 [M] Migrador com checksum (recusa migração editada) + `npm run migrate:status`; versão do schema no health e na Sidebar
- [ ] T-019 [P] Limpeza: remover `migrate_session_type.js` da raiz e trocar `schema.sql` duplicado por snapshot gerado
- [ ] T-020 [P] Função `set_updated_at()` e gatilhos; "Atualizado em" nos Detalhes da Palavra [v1 T-044]
- [ ] T-021 [P] Índices nas chaves estrangeiras e nas consultas quentes [v1 T-045]
- [ ] T-022 [M] Revisar `ON DELETE` + rota e botão "Excluir contexto" [v1 T-046]
- [ ] T-023 [P] `docs/data-model.md` com diagrama Mermaid e dicionário de dados [v1 T-047]
- [ ] T-024 [P] Todas as migrações em banco vazio e na cópia do backup; comparar snapshots [v1 T-048]

## Fase 5 — ORM (D-05, D-06)
- [ ] T-025 [M] ADR `docs/adr/0001-orm.md` + instalar ORM + introspecção do banco + cliente compartilhando o pool
- [ ] T-026 [P] Verificação de drift do schema do ORM (`npm run db:check-drift`) + passo no CI
- [ ] T-027 [M] Camada de repositórios com escopo por estudante; migrar rotas `students` e `tenses`
- [ ] T-028 [P] Migrar rotas `sessions` para o ORM
- [ ] T-029 [M] Migrar rota `dashboard` (agregações parametrizadas)
- [ ] T-030 [M] Migrar rotas `sentences` e `paragraphs`
- [ ] T-031 [M] Migrar `vocabulary` — leitura (lista e detalhe)
- [ ] T-032 [M] Migrar `vocabulary` — escrita (criar, editar, excluir, frases, contextos, significados) com transação
- [ ] T-033 [M] Migrar `reviews` — fila de revisão
- [ ] T-034 [M] Migrar `reviews` — registrar revisão, histórico, erros, frase do aluno
- [ ] T-035 [P] Migrar `seed.js`; regra de lint que proíbe SQL montado por concatenação; `db.query` só no migrador

## Fase 6 — TypeScript (D-07)
- [ ] T-036 [M] Base TypeScript no server (`tsconfig` com allowJs, `typecheck`, CI) e ajuste do conteúdo do script `dev`
- [ ] T-037 [M] Converter `config`, `middleware` e `services` do server para TS
- [ ] T-038 [M] Converter rotas e repositórios `students`, `tenses`, `sessions`, `dashboard`
- [ ] T-039 [M] Converter rotas e repositórios `sentences` e `vocabulary`
- [ ] T-040 [M] Converter `reviews` e `index`; desligar allowJs no server; `strict`
- [ ] T-041 [M] Base TypeScript no client (`typecheck`), `api.js` → `api.ts` com tipos; arquivos novos em TS

## Fase 7 — Segurança
- [ ] T-042 [M] Tratamento central de erros (formato JSON único, sem vazar SQL) + Toast de erros no client [v1 T-071]
- [ ] T-043 [M] Middleware `validate` com Zod + schemas de `students`, `sessions`, `tenses`; erros por campo no form de estudante [v1 T-072]
- [ ] T-044 [M] Zod em `vocabulary`; erros por campo em Novo Verbo e Detalhes da Palavra
- [ ] T-045 [M] Zod em `reviews`, `sentences` e `dashboard`; erros por campo no Banco de Frases
- [ ] T-046 [P] helmet + CORS restrito por variável de ambiente + limite de tamanho do corpo
- [ ] T-047 [P] Rate limit (mais rígido em escrita) + mensagem amigável para 429
- [ ] T-048 [P] Logs com pino/pino-http (request id, redação de segredos); request id no Toast de erro 500
- [ ] T-049 [P] `npm audit` (corrigir sem breaking) + passo no CI + atualizar documento de segurança

## Fase 8 — Isolamento por estudante
- [x] T-050 Isolamento ponta a ponta: dono no banco, FKs compostas, `requireStudent`, `X-Student-Id` no cliente, testes [v1 T-020–T-030] ✔ legado 2026-10-01
- [ ] T-051 [M] Recertificação pós-ORM/TS: teste que percorre todas as rotas e exige `X-Student-Id`; teste de FK composta no banco
- [ ] T-052 [M] Trocar de estudante pela Sidebar e estudante ativo sempre visível
- [ ] T-053 [M] Estudante novo: estados vazios com chamada para ação + "pacote inicial" de palavras

## Fase 9 — Tradução para inglês e i18n
- [ ] T-054 [P] Inventário de português (`docs/translation-inventory.md`) gerado por script somente leitura
- [ ] T-055 [M] i18next + react-i18next + detector; locales `en` e `pt-BR`; seletor de idioma na Sidebar (D-15)
- [ ] T-056 [M] Extrair textos: StudentSelect, Sidebar, UI, App
- [ ] T-057 [M] Extrair textos: Dashboard e Progresso
- [ ] T-058 [M] Extrair textos: Vocabulário, Detalhes da Palavra, Novo Verbo
- [ ] T-059 [M] Extrair textos: StudySession parte 1 (escolha de modo e quiz personalizado)
- [ ] T-060 [M] Extrair textos: StudySession parte 2 (cartão e avaliação) + Frases, Parágrafos, Busca
- [ ] T-061 [M] Server em inglês: mensagens da API e comentários; client traduz erros pelo `code`
- [ ] T-062 [P] Testes, seed, scripts e utils em inglês (sem editar migrações aplicadas)
- [ ] T-063 [M] Nomes de arquivos em inglês + links + guarda no CI contra português no código

## Fase 10 — Experiência de estudo (quiz como formato principal)
- [ ] T-064 [M] ADR `docs/adr/0002-fsrs.md` + migração do estado FSRS e `review_logs` com backfill (D-14)
- [ ] T-065 [P] Serviço `scheduler` com ts-fsrs (avaliar e prévia de intervalos) + testes
- [ ] T-066 [M] API de estudo: `GET /api/study/queue` e `POST /api/study/answer` (nota 1–4)
- [ ] T-067 [M] Cartão de quiz estilo Anki (Again/Hard/Good/Easy com prévia e atalhos) como fluxo padrão de "Estudar Agora"
- [ ] T-068 [M] Tipos de cartão a partir dos dados existentes (significado, lacuna com frases, contextos, formas verbais)
- [ ] T-069 [M] API de quizzes personalizados persistidos (`/api/quizzes`) usando as tabelas do v1 T-042
- [ ] T-070 [M] Tela "Meus quizzes": criar bloco de 5/10, editar, jogar e ver resultado
- [ ] T-071 [M] Prática com parágrafos: leitura + lacunas nas palavras ligadas, avaliada como revisão
- [ ] T-072 [M] Gerador de frases por tempo verbal (regras/templates, irregulares via `verb_forms`) + testes [v1 T-050, T-051]
- [ ] T-073 [P] `POST /api/sentences/generate` (escopo do estudante, não grava) [v1 T-052]
- [ ] T-074 [M] Botão "Gerar frases" com aprovação antes de salvar + documento de limites [v1 T-053, T-054]
- [ ] T-075 [M] API de estatísticas de aprendizado (retenção, revisões por dia, previsão, sequência)
- [ ] T-076 [M] Dashboard de aprendizado: retenção, heatmap de 365 dias, revisões por dia, previsão
- [ ] T-077 [M] Aposentar o fluxo Difícil/Parcial/Fácil, remover código morto, `docs/srs-algorithm.md` [v1 T-070]
- [ ] T-078 [P] Revisar a matriz de usabilidade: todo ❌ resolvido ou levado ao roadmap [v1 T-061]

## Fase 11 — Voz (Web Speech API, gratuita)
- [ ] T-079 [M] Hook `useSpeech` + preferências de voz (voz, sotaque, velocidade) salvas
- [ ] T-080 [M] Reconhecimento de fala com detecção de suporte + pontuação de pronúncia (função pura) (D-18)
- [ ] T-081 [M] Gravar prática de pronúncia (`pronunciation_practice`) + botão "Falar" no cartão + tendência no Progresso

## Fase 12 — Testes de ponta a ponta e cobertura
- [ ] T-082 [M] Playwright: configuração com banco de teste + teste de fumaça (criar estudante, adicionar palavra)
- [ ] T-083 [M] E2E: fluxo de estudo e isolamento entre estudantes
- [ ] T-084 [P] Cobertura no Jest e no Vitest com metas aplicadas no CI
- [ ] T-085 [P] E2E no CI com relatório como artefato

## Fase 13 — Documentação e open source
- [ ] T-086 [M] OpenAPI gerado dos schemas Zod + Swagger UI em `/api/docs` (fora de produção)
- [ ] T-087 [P] `LICENSE` (D-03), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` [v1 T-080, T-081, T-087]
- [ ] T-088 [P] Modelos de issue e PR em `.github/` + `CHANGELOG.md` [v1 T-087]
- [ ] T-089 [P] Segredos e dados pessoais: histórico do `.env`, `.gitignore`, `.env.example`, seeds neutros [v1 T-082–T-084]
- [ ] T-090 [P] Capturas de tela automáticas (Playwright) em `docs/images/`
- [ ] T-091 [M] README final (pt-BR) com a skill de README: badges reais, stack, endpoints, links conferidos [v1 T-085, T-086]

## Fase 14 — Prova de fogo
- [ ] T-092 [M] Clone limpo + banco vazio, seguir o README como um estranho; cada atrito vira `add-feature` [v1 T-090]

## Fase 15 — Tradução final
- [ ] T-093 [M] README em inglês + `README.pt-BR.md` com links cruzados (D-08)
- [ ] T-094 [M] Planejamento em inglês: renomear `plano-de-acao/` e arquivos, ajustar `plan_tool.py`, skills em inglês (D-16)

## Funcionalidade adicionada Nº 2 — Correcao de Testes Conhecidos (em 2026-10-04 01:32)
- [ ] T-096 [P] Corrigir testes legados do client (srs.test.js e tts.test.js)
- [ ] T-097 [P] Corrigir teste do server de status red vs yellow em POST /api/reviews
