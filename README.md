# StudyReviewBlast

> **English summary:** Personal spaced-repetition and active-recall platform for language learners. Multi-student, fully offline, no paid services. Stack: PostgreSQL 18 · Node 24 + Express · React 19 + Vite. See [Decisões explicadas](#decisões-explicadas) for architectural choices.

[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Índice

- [Resumo do projeto](#resumo-do-projeto)
- [Stack e pré-requisitos](#stack-e-pré-requisitos)
- [Como rodar](#como-rodar)
- [Onde parei / como prosseguir](#onde-parei--como-prosseguir)
- [Algoritmo de um dia de trabalho](#algoritmo-de-um-dia-de-trabalho)
- [Fases e tarefas do Plano V2](#fases-e-tarefas-do-plano-v2)
- [Como retomar após interrupção](#como-retomar-após-interrupção)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Testes e qualidade](#testes-e-qualidade)
- [Decisões explicadas](#decisões-explicadas)
- [Melhorias pós-prova de fogo](#melhorias-pós-prova-de-fogo)
- [Licença](#licença)

---

## Resumo do projeto

**StudyReviewBlast** é uma plataforma de estudo por repetição espaçada (*SRS*) e recordação ativa (*Active Recall*) voltada para aquisição de vocabulário em inglês (e futuramente outros idiomas). Funciona 100% offline, sem login, sem serviço externo, com suporte a múltiplos perfis de estudante — cada um com seu próprio catálogo isolado de palavras, revisões, frases e histórico.

**Funcionalidades principais:**
- Fila de revisão inteligente (algoritmo FSRS — planejado na Fase 10).
- Cartão de quiz estilo Anki (Again / Hard / Good / Easy) com prévia de intervalo.
- Quiz personalizado: blocos de 5 ou 10 perguntas com contextos e frases.
- Isolamento completo por estudante no banco (FKs compostas) e na API (middleware `requireStudent`).
- Síntese de voz nativa (`SpeechSynthesis`) e reconhecimento de fala opcional (`SpeechRecognition`).
- Dashboard com KPIs de retenção, heatmap de atividade e previsão de revisões.

---

## Stack e pré-requisitos

| Camada | Tecnologia | Versão |
|---|---|---|
| Banco | PostgreSQL | **18** |
| Runtime | Node.js | **24** |
| Backend | Express + pg | 4.x + 8.x |
| Frontend | React + Vite | 19 + 8 |
| Roteamento | react-router-dom | 7.x |
| HTTP client | Axios | 1.x |
| Testes backend | Jest + Supertest | 29 + 7 |
| Testes frontend | Vitest | 5 |
| Lint frontend | Oxlint | 1.x |

**Para rodar localmente você precisa de:**
- Node.js 24 (`node --version`)
- npm 10+ (`npm --version`)
- PostgreSQL 18 na porta 5432

---

## Como rodar

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/mghkill/Study-Review-Blast.git
cd Study-Review-Blast

npm install --prefix server
npm install --prefix client
```

### 2. Configurar o `.env`

```bash
cp .env.example .env
# Edite .env com suas credenciais locais do PostgreSQL
```

| Variável | Obrigatório | Exemplo |
|---|---|---|
| `DB_HOST` | Sim | `localhost` |
| `DB_PORT` | Sim | `5432` |
| `DB_NAME` | Sim | `reviewdatabase` |
| `DB_USER` | Sim | `postgres` |
| `DB_PASSWORD` | Sim | *(sua senha local)* |
| `PORT` | Não | `3001` |
| `NODE_ENV` | Não | `development` |

### 3. Migrar e popular o banco

```bash
npm run migrate --prefix server   # aplica migrations em ordem
npm run seed --prefix server      # cria estudante inicial e vocabulário demo
```

### 4. Subir os servidores (dois terminais)

```bash
# Terminal 1 — API (porta 3001)
cd server && npm run dev

# Terminal 2 — Interface (porta 5173)
cd client && npm run dev
```

- Health check: http://localhost:3001/api/health
- Interface: http://localhost:5173

---

## Onde parei / como prosseguir

**Prompt que você dá à IA a cada sessão:**

```
Leia plano-de-acao/RETOMAR.md e execute a T-0XX.
```

Substitua `0XX` pelo número exibido em `plano-de-acao/PLANO.md → ## PRÓXIMO PASSO`, ou rode:

```powershell
py plano-de-acao/plan_tool.py status
```

---

## Algoritmo de um dia de trabalho

```
1. py plano-de-acao/plan_tool.py status
2. Ler PLANO.md → bloco "PRÓXIMO PASSO"
3. Ler TAREFAS.md → cartão da tarefa (### T-0XX)
4. Ler últimas 20 linhas de LINHA-DO-TEMPO.md
5. git status + git log -3
──────────────────────────────────────
6. plan_tool.py start T-0XX
7. Escrever o teste ANTES e vê-lo FALHAR
8. Implementar até o teste passar
──────────────────────────────────────
PAUSA OBRIGATÓRIA (ver plano-de-acao/RETOMAR.md §3):
9. Rodar testes e lint
10. git add . (na raiz) + git commit
11. plan_tool.py done T-0XX --nota "..."
12. PARAR — não avance sem aprovação
```

---

## Fases e tarefas do Plano V2

O plano completo está em [`plano-de-acao/PLANO.md`](./plano-de-acao/PLANO.md). Resumo das fases:

| Fase | Título | Tarefas | Prompt da IA |
|---|---|---|---|
| 1 | Reconhecimento e rede de segurança | T-001–T-004 | `Leia plano-de-acao/RETOMAR.md e execute a T-001.` |
| 2 | Qualidade e ferramentas base | T-005–T-011 | `… T-005` … `… T-011` |
| 3 | Ambiente reproduzível | T-012–T-015 | `… T-012` … `… T-015` |
| 4 | Migrações versionadas e modelo lógico | T-016–T-024 | `… T-016` … `… T-024` |
| 5 | ORM (D-05, D-06) | T-025–T-035 | `… T-025` … |
| 6 | TypeScript (D-07) | T-036–T-041 | `… T-036` … |
| 7 | Segurança | T-042–T-049 | `… T-042` … |
| 8 | Isolamento por estudante | T-050–T-053 | `… T-051` … |
| 9 | Tradução para inglês e i18n | T-054–T-063 | `… T-054` … |
| 10 | Experiência de estudo (FSRS + quiz Anki) | T-064–T-078 | `… T-064` … |
| 11 | Voz (Web Speech API, gratuita) | T-079–T-081 | `… T-079` … |
| 12 | Testes de ponta a ponta e cobertura | T-082–T-085 | `… T-082` … |
| 13 | Documentação e open source | T-086–T-091 | `… T-086` … |
| 14 | Prova de fogo | T-092 | `… T-092` |
| 15 | Tradução final do planejamento | T-093–T-094 | `… T-093` … |

> T-016, T-017 e T-050 já estão concluídas (feitas no Plano V1).

---

## Como retomar após interrupção

Se a IA encerrou por falta de tokens ou foi trocada no meio de uma tarefa:

1. Veja se a tarefa está marcada `[~]` em `PLANO.md`. Se não, rode `plan_tool.py start T-0XX`.
2. Leia as últimas 20 linhas de `LINHA-DO-TEMPO.md`.
3. Rode `git status` — se houver arquivos não commitados, avalie se o trabalho parcial está correto.
4. Use o prompt: `Leia plano-de-acao/RETOMAR.md e continue a T-0XX (interrompida).`

---

## Endpoints da API

Todos os endpoints exceto `/api/health` e `/api/students` exigem o header `X-Student-Id`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status e conectividade com o banco |
| `GET`, `POST` | `/api/students` | Listar perfis e criar novo (começa vazio) |
| `GET`, `PATCH`, `DELETE` | `/api/students/:id` | Buscar, atualizar ou remover perfil |
| `GET` | `/api/tenses` | Listar tempos verbais canônicos |
| `GET`, `POST` | `/api/vocabulary` | Listar ou criar palavra do estudante |
| `GET`, `PATCH`, `DELETE` | `/api/vocabulary/:id` | Detalhe, editar ou remover palavra |
| `POST` | `/api/vocabulary/:id/sentences` | Adicionar frase à palavra |
| `POST` | `/api/vocabulary/:id/contexts` | Adicionar contexto à palavra |
| `PATCH` | `/api/vocabulary/:id/meanings/:mId` | Editar significado |
| `GET` | `/api/reviews/queue` | Fila de revisão SRS do estudante |
| `POST` | `/api/reviews` | Registrar revisão (recalcula intervalo) |
| `GET` | `/api/reviews/history` | Histórico de revisões |
| `GET` | `/api/reviews/errors` | Análise de erros por categoria |
| `POST` | `/api/reviews/student-sentence` | Salvar frase do estudante na revisão |
| `POST` | `/api/sessions` | Criar sessão de estudo |
| `PATCH` | `/api/sessions/:id` | Finalizar sessão |
| `GET` | `/api/dashboard` | KPIs agregados do estudante |
| `GET`, `POST` | `/api/sentences` | Frases do estudante |
| `GET`, `POST` | `/api/sentences/paragraphs` | Parágrafos do estudante |

---

## Estrutura do projeto

```text
Study-Review-Blast/
├── client/                    # SPA React + Vite (porta 5173)
│   ├── src/
│   │   ├── components/        # Sidebar, TTSButton, Badges...
│   │   ├── context/           # AppContext (estudante ativo)
│   │   ├── pages/             # Dashboard, StudySession, VocabDetail...
│   │   ├── test/              # Vitest (isolamento, SRS)
│   │   ├── api.js             # Axios + interceptor X-Student-Id
│   │   └── index.css          # Dark theme, glassmorphic
│   └── package.json
├── server/                    # API Express (porta 3001)
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrations/    # 001_baseline.sql, 002_…, …
│   │   │   ├── migrator.js    # Executor de migrations (Node puro)
│   │   │   ├── migrate.js     # Script npm run migrate
│   │   │   ├── connection.js  # Pool pg
│   │   │   └── seed.js        # Seed inicial
│   │   ├── middleware/        # requireStudent
│   │   ├── routes/            # students, vocabulary, reviews...
│   │   ├── services/          # SRS (algoritmo de intervalo)
│   │   └── index.js           # Entry point Express
│   ├── tests/                 # Jest + Supertest
│   └── package.json
├── docs/                      # Documentação técnica
├── plano-de-acao/             # Plano V2, tarefas, linha do tempo
│   ├── RETOMAR.md             # ← Leia isto todos os dias
│   ├── PLANO.md               # Progresso e decisões
│   ├── TAREFAS.md             # Cartões detalhados de cada tarefa
│   ├── LINHA-DO-TEMPO.md      # Histórico cronológico
│   └── plan_tool.py           # Ferramenta de progresso
├── skills/                    # Skill studyreviewblast-planner
├── .env.example
└── README.md
```

---

## Testes e qualidade

```bash
# Backend (Jest + Supertest)
npm test --prefix server

# Frontend (Vitest)
npm run test:run --prefix client

# Lint frontend (Oxlint)
npm run lint --prefix client

# Auditoria de segurança
npm audit --omit=dev --prefix server
npm audit --omit=dev --prefix client
```

---

## Decisões explicadas

Explicações em linguagem simples das decisões arquiteturais do Plano V2. A lista completa (D-01 a D-18) com alternativas está em [`plano-de-acao/PLANO.md`](./plano-de-acao/PLANO.md).

| ID | Decisão | O que isso significa |
|---|---|---|
| D-01 | Posse dos dados | Cada palavra pertence a um só estudante. Dois estudantes podem ter "run" cadastrada, mas são registros completamente separados no banco. *(Decidido no V1)* |
| D-02 | Dados atuais | Os dados existentes no banco de desenvolvimento são preservados. Antes de cada fase com migração, fazemos backup. Os testes rodam em banco separado (`_test`). *(Confirmado em 2026-10-03)* |
| D-03 | Licença e autor | MIT, `Copyright (c) 2026 mghkill`. Gratuita, permite uso comercial, exige manter o aviso. *(Confirmado em 2026-10-03)* |
| D-04 | Identificação sem login | O cliente envia `X-Student-Id` no cabeçalho de cada requisição. O servidor valida pelo middleware `requireStudent`. Sem JWT, sem sessão — uso local offline. *(Decidido no V1)* |
| D-05 | ORM | Drizzle ORM (introspecção + geração de tipos). *(Confirmado em 2026-10-03)* |
| D-06 | Quem manda no schema | As migrations SQL continuam a fonte de verdade. O schema do ORM é gerado por introspecção e conferido no CI (drift check). *(Confirmado em 2026-10-03)* |
| D-07 | TypeScript | Adotado de forma incremental a partir da Fase 6: server primeiro, depois client. Arquivos existentes em JS são convertidos gradualmente; novos arquivos já nascem em TS. *(Confirmado em 2026-10-03)* |
| D-08 | Idioma do README | pt-BR até a Fase 14 (com resumo em inglês no topo). Na Fase 15 vira inglês e o pt-BR fica em `README.pt-BR.md`. *(Confirmado em 2026-10-03)* |
| D-09 | `package.json` na raiz | Criado só para ferramentas (hooks, lint, testes unificados). Os scripts de `server/` e `client/` não mudam. *(Confirmado em 2026-10-03)* |
| D-10 | Dependências aprovadas | Apenas as listadas em `PLANO.md §Dependências aprovadas`. Dependência fora da lista vira nova decisão antes de instalar. *(Confirmado em 2026-10-03)* |
| D-11 | Docker | Aguardando decisão do usuário: instalar Docker Desktop antes da T-014 vs não instalar agora (manter PostgreSQL local nativo e deixar compose.yml para quem quiser usar). |
| D-12 | Banco de testes | Banco separado (`<DB_NAME>_test`), criado e migrado automaticamente pelo setup do Jest. Os testes nunca tocam no banco de desenvolvimento. |
| D-13 | Branches e PRs | Uma branch por fase (`v2/phase-NN-slug`). Ao fim de cada fase o desenvolvedor faz push, abre PR e faz merge. A IA não faz push. |
| D-14 | Algoritmo de revisão | FSRS (`ts-fsrs`) — decide *quando* revisar cada item. Requer confirmação explícita do usuário antes da Fase 10. |
| D-15 | Idioma da interface | Detecta o idioma do navegador; padrão `en`; seletor `en`/`pt-BR` salvo localmente. |
| D-16 | Planejamento em inglês | Na Fase 15, a pasta `plano-de-acao/` e os arquivos de planejamento são renomeados para inglês. |
| D-17 | Lint do client | Oxlint (já configurado) mantido no client. ESLint só no server. Prettier nos dois. |
| D-18 | Reconhecimento de voz | `SpeechRecognition` (Web Speech API), opcional, desligado por padrão. No Chrome o áudio vai para servidores do Google; Firefox não suporta. |

---

## Melhorias pós-prova de fogo

Funcionalidades e serviços que foram excluídos do V2 por custo ou complexidade, para considerar depois que o projeto estiver pronto para open source:

| Melhoria | Custo estimado | Quando considerar |
|---|---|---|
| **Login com senha ou OAuth** | Gratuito (implementação); hosting ~$5–20/mês | Após prova de fogo, se quiser hospedar para outros |
| **Hospedagem (Railway, Render, Fly.io)** | ~$5–20/mês | Após prova de fogo |
| **TTS premium** (ElevenLabs, Google Cloud TTS) | ~$0,016/1k caracteres | Se a qualidade do `SpeechSynthesis` não satisfizer |
| **Geração de frases com IA** (OpenAI, Gemini) | ~$0,002–0,03/1k tokens | Se o gerador offline ficar limitado demais |
| **Monitoramento de erros** (Sentry) | Gratuito até 5k eventos/mês | Em produção |
| **Banco de dados gerenciado** (Neon, Supabase) | Gratuito com limites | Em produção |
| **Row-Level Security (RLS) no PostgreSQL** | Gratuito | Se mover para multi-tenant com login real |

---

## Licença

MIT — veja [LICENSE](./LICENSE). *(Arquivo será criado na T-087.)*
