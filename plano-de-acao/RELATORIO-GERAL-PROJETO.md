# Relatório Geral do Projeto — Estrutura Atual, Visão de Futuro e Guia para IA de Planejamento

> **Destinatário:** IAs de planejamento e desenvolvedores que assumirem a evolução do **StudyReviewBlast**.  
> **Objetivo:** Explicar em detalhes a arquitetura 100% real do projeto, o que ele já possui, em que ele vai se transformar ao final das 15 fases do Plano V2, todas as funcionalidades entregues ao usuário e as regras inegociáveis de condução.

---

## 1. O que é o StudyReviewBlast?

O **StudyReviewBlast** é uma plataforma completa de aprendizado de idiomas focada em **Repetição Espaçada (*Spaced Repetition System - SRS*)** e **Recordação Ativa (*Active Recall*)**, inicialmente especializada em verbos e vocabulário em inglês, com arquitetura extensível para qualquer idioma.

### Princípios Cardeais
1. **100% Gratuito e Local:** Nenhum serviço externo pago, nenhuma API de IA proprietária (OpenAI, Gemini comercial, Claude API), nenhum TTS pago (ElevenLabs). Tudo roda no computador do usuário.
2. **Multi-Estudante com Isolamento Rigoroso:** Vários estudantes podem usar a mesma máquina/navegador. Cada estudante possui seu próprio banco de palavras, frases, progresso e estatísticas, totalmente isolados em nível de banco de dados e de API.
3. **Uso Local sem Login Obrigatório:** Para uso em casa ou sala de aula local, a identificação é feita via perfil ativo no navegador (contexto React) e cabeçalho `X-Student-Id` validado no servidor Express, sem complexidade de senhas ou autenticação JWT inicial.
4. **Soberania do Banco Relacional:** O PostgreSQL 18 é a âncora de verdade. Regras de integridade, chaves compostas e migrações SQL mandam na estrutura.

---

## 2. Estrutura 100% Atual do Repositório (Raio-X do Disco)

```text
Study-Review-Blast/
├── .env.example                       # Modelo de configuração de ambiente (sem segredos)
├── .gitignore                         # Proteção contra node_modules, .env, builds, etc.
├── README.md                          # Guia mestre do projeto (vitrine, stack, fases, decisões)
│
├── server/                            # BACKEND — API REST em Node.js 24 + Express
│   ├── package.json                   # Express 4.18.2, pg 8.11.3, dotenv 16.4.5, cors 2.8.5
│   ├── tests/                         # Suíte Jest + Supertest
│   │   ├── api.test.js                # Testes de integração de todas as rotas da API
│   │   ├── isolation.test.js          # 13 testes garantindo isolamento estrito entre estudantes
│   │   └── migrator.test.js           # Testes unitários do motor de migrações
│   └── src/
│       ├── index.js                   # Ponto de entrada do servidor (porta 3001)
│       ├── routes/                    # Rotas da API REST
│       │   ├── students.js            # CRUD de estudantes (perfis)
│       │   ├── vocabulary.js          # Vocabulário, significados, contextos, formas verbais
│       │   ├── reviews.js             # Fila de revisão SRS, registro de estudo e erros
│       │   ├── sessions.js            # Sessões de estudo e histórico
│       │   ├── sentences.js           # Banco de frases e parágrafos
│       │   └── dashboard.js           # Métricas agregadas por estudante
│       ├── middleware/
│       │   └── requireStudent.js      # Middleware que valida e injeta req.studentId via X-Student-Id
│       ├── services/
│       │   └── srs.js                 # Algoritmo heurístico original de repetição espaçada
│       └── db/
│           ├── connection.js          # Pool de conexões do pg
│           ├── migrator.js            # Executor transacional de migrações em Node puro
│           ├── migrate.js             # Script CLI 'npm run migrate'
│           ├── seed.js                # Script CLI 'npm run seed' (dados demonstrativos)
│           └── migrations/            # Migrações SQL numeradas e versionadas
│               ├── 001_baseline.sql   # Schema base com 16 tabelas originais
│               ├── 002_vocabulary_owner.sql                  # student_id em vocabulary_items
│               ├── 003_migrate_vocabulary_owners.sql         # Clonagem de vocabulário existente por aluno
│               ├── 004_composite_foreign_keys.sql            # FKs compostas (id, student_id)
│               ├── 005_cascade_delete_student.sql            # Deleção em cascata segura
│               ├── 006_tenses_table.sql                      # Tabela canônica de 12 tempos verbais
│               ├── 007_session_type_and_sentence_source_checks.sql # CHECKs de sessão e frases geradas
│               ├── 008_custom_quizzes.sql                    # Tabelas custom_quizzes e perguntas
│               ├── 009_language_code.sql                     # language_code (padrão 'en')
│               └── README.md                                 # Documentação interna das migrações
│
├── client/                            # FRONTEND — SPA em React 19 + Vite 8
│   ├── package.json                   # React 19.2.8, Vite 8.3, react-router-dom 7.18, axios 1.20, chart.js 4.5
│   ├── index.html                     # HTML raiz da aplicação
│   ├── vite.config.js                 # Configuração do Vite e proxy para /api -> localhost:3001
│   └── src/
│       ├── main.jsx                   # Bootstrapping do React no DOM
│       ├── App.jsx                    # Rotas, Layout principal e sincronização de perfis
│       ├── api.js                     # Cliente Axios com interceptor injetando X-Student-Id
│       ├── index.css                  # Design System dark/glassmorphic customizado
│       ├── context/
│       │   └── AppContext.jsx         # Contexto global: estudante ativo persistido no localStorage
│       ├── pages/                     # Telas completas da interface
│       │   ├── Dashboard.jsx          # Visão geral, contadores e atalhos de estudo
│       │   ├── StudySession.jsx       # Modo de estudo e prática de revisões
│       │   ├── VocabularyPage.jsx     # Catálogo de vocabulário com filtros e busca
│       │   ├── VocabDetail.jsx        # Detalhe de palavra, significados, contextos e tempos
│       │   ├── AddVerb.jsx            # Formulário estruturado de cadastro de verbos e formas
│       │   ├── SentencesPage.jsx      # Banco de frases associadas a tempos verbais
│       │   ├── ParagraphsPage.jsx     # Textos e parágrafos com palavras vinculadas
│       │   ├── SearchPage.jsx         # Busca global
│       │   └── ProgressPage.jsx       # Gráficos de evolução, retenção e erros (Chart.js)
│       ├── components/                # Componentes reutilizáveis (Sidebar, TTSButton, Badges, Modals...)
│       ├── hooks/                     # Custom hooks React (useTenses, useSpeech...)
│       ├── utils/                     # Formatadores e helpers utilitários
│       └── test/                      # Testes com Vitest
│           ├── setup.js               # Configuração do ambiente de teste
│           ├── student_isolation.test.js # Testes de isolamento do frontend
│           ├── srs.test.js            # Testes do algoritmo de intervalo
│           └── tts.test.js            # Testes do módulo de síntese de fala
│
├── plano-de-acao/                     # MOTOR OPERACIONAL DO PLANEJAMENTO V2
│   ├── PLANO.md                       # Estado ativo do plano: 15 fases, 94 tarefas, decisões D-01 a D-18
│   ├── TAREFAS.md                     # Os 94 cartões detalhados (Objetivo, Back, Front, Teste antes, Pausa)
│   ├── RETOMAR.md                     # Manual operacional diário da IA (ordem de leitura e pausa)
│   ├── LINHA-DO-TEMPO.md              # Log cronológico imutável de todas as ações executadas
│   ├── plan_tool.py                   # Script CLI de automação (status, start, done, log, add-feature)
│   ├── PROMPT_ORIGINAL.md             # Instruções primitivas do projeto preservadas
│   ├── RELATORIO-GERAL-PROJETO.md     # ESTE DOCUMENTO — Guia mestre de arquitetura e evolução
│   └── legado/                        # Museu e histórico do Plano V1 congelado
│       ├── PLANO-v1.md                # Plano antigo (26 tarefas concluídas preservadas)
│       ├── RETOMAR-v1.md              # Protocolo antigo do V1 em inglês
│       ├── PLANO.inicial-v1.md        # Template inicial bruto
│       ├── MAPA-V1-V2.md              # De-para exato de cada tarefa antiga para o novo V2
│       ├── PROMPT_INICIAL_LEGADOV2.md # Prompt mestre que ordenou a reconstrução do plano
│       └── RELATORIO-RECONSTRUCAO-V2.md # Registro técnico da transição entre IAs (Sessão 1 -> Opus 5.5 -> Gemini)
│
└── skills/                            # PACOTE DE INSTRUÇÕES DE ENGENHARIA DA IA
    ├── SKILLENG.md                    # Diretrizes técnicas da IA planejadora (estratégia, stack, regras)
    ├── skill.md                       # Diretrizes para documentação e README open source
    ├── assets/                        # Templates e esqueletos de apoio
    │   └── README.template.md         # Template de documentação profissional
    ├── references/                    # Base de conhecimento e convenções do repositório
    │   ├── convencoes-v2.md           # Padrões de código, branches, Conventional Commits e testes
    │   ├── diagnostico-atual.md       # [Histórico] Análise preliminar do projeto pré-V1
    │   ├── modelo-logico-alvo.md      # [Histórico/Ref] Modelagem relacional e status das migrations 002–009
    │   ├── open-source-basico.md      # Guia conceitual de licença MIT, badges e CONTRIBUTING
    │   └── open-source-checklist.md   # Lista de conferência para lançamento público
    └── scripts/
        ├── plan_tool.py               # Cópia mestre da ferramenta de planejamento
        └── detect_stack.py            # Analisador automático de stack e dependências
```

---

## 3. Estado Real do Projeto Hoje (O Que Já Funciona)

Graças às 26 tarefas concluídas no V1 (preservadas no legado) e ao planejamento rigoroso do V2:

1. **Isolamento de Dados Completo (Fase 8 parcial no V2 / Fase 2 no V1):**
   - No banco: tabelas `vocabulary_items`, `contexts`, `sentences`, `reviews`, `errors`, `student_vocabulary`, `tense_practice` possuem `student_id` e usam chaves estrangeiras compostas `(id, student_id)`. É impossível no nível do PostgreSQL gravar o progresso de um estudante em uma palavra de outro.
   - No backend: o middleware `requireStudent` intercepta as rotas protegidas, valida a existência do estudante e injeta `req.studentId`. Qualquer tentativa de ler ou editar dados alheios responde `404 Not Found`.
   - No frontend: o interceptor do Axios em `api.js` anexa automaticamente o cabeçalho `X-Student-Id: <id>` em todas as requisições com base no perfil selecionado na interface.
2. **Migrações Versionadas Próprias (Fase 4 parcial no V2 / Fase 1 no V1):**
   - Sistema idempotente sem dependências externas (`server/src/db/migrator.js`).
   - Tabela de controle `schema_migrations` registrando versão, nome e data de aplicação.
   - 9 migrações aplicadas e testadas com sucesso em bancos limpos e populados.
3. **Estrutura Relacional Enriquecida:**
   - Tabela `tenses` canônica com 12 tempos verbais em inglês e foreign keys aplicadas.
   - Tabelas prontas para Quizzes Personalizados (`custom_quizzes` e `custom_quiz_questions`).
   - Suporte a identificador de idioma (`language_code = 'en'`).
4. **Motor de Planejamento Operacional:**
   - 94 tarefas dimensionadas para execução de **1 sessão por tarefa**, evitando esgotamento de tokens de contexto.
   - Script `plan_tool.py` operacional e integrado ao fluxo de trabalho.

---

## 4. O Que o Projeto Vai Se Tornar (A Visão Alvo do V2)

Ao longo das **15 fases do Plano V2** ([`plano-de-acao/PLANO.md`](file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/PLANO.md)), o projeto sofrerá uma metamorfose estrutural de altíssimo nível, tornando-se uma referência em engenharia de software open source:

```
[Hoje: JavaScript puro, scripts soltos, SRS rudimentar]
                         ⬇️
Fase 1: Rede de segurança (branch limpa, backup verificado, baseline real)
Fase 2: Infraestrutura profissional (Root package.json, ESLint Flat, Prettier, Husky, Commitlint, CI GitHub Actions)
Fase 3: Ambiente reproduzível (Banco de testes _test isolado, validação Zod no .env, compose.yml opcional)
Fase 4: Blindagem das migrações SQL (checksum SHA-256, triggers updated_at, índices em FKs)
Fase 5: Adoção do ORM Drizzle (Camada de repositórios tipada mantendo SQL migrations como fonte da verdade)
Fase 6: Transição para TypeScript Incremental (Server 100% TS strict, Client api.ts e types)
Fase 7: Blindagem de Segurança e Logs (Helmet, CORS restrito, rate limiting inteligente, Pino logger)
Fase 8: Recertificação do Isolamento (Troca dinâmica de estudante na Sidebar, pacotes iniciais de estudo)
Fase 9: Internacionalização Completa (i18n en / pt-BR no front, código e rotas 100% em inglês)
Fase 10: Revolução no Estudo (FSRS - Free Spaced Repetition Scheduler, Quiz Anki, Gerador Offline de Frases)
Fase 11: Treinamento de Pronúncia por Voz (Web Speech API nativa: TTS e reconhecimento sem custos)
Fase 12: Testes End-to-End e Cobertura (Playwright E2E em CI, metas de cobertura Jest/Vitest)
Fase 13: Documentação e Preparação Open Source (Swagger OpenAPI gerado de Zod, MIT, CHANGELOG)
Fase 14: Prova de Fogo (Instalação e execução do zero em máquina limpa como um usuário desconhecido)
Fase 15: Tradução do Planejamento para Inglês
                         ⬇️
[Futuro: Plataforma moderna, em TypeScript, com FSRS, voz, multilíngue, segura e pronta para o mundo]
```

---

## 5. Funcionalidades Que o Usuário Final Conseguirá Realizar

Quando o Plano V2 estiver concluído, o usuário final terá em mãos uma plataforma educacional extraordinária:

### A. Experiência de Aprendizado e Estudo
- **Fila de Revisão Inteligente com FSRS:** Em vez de intervalos arbitrários, o algoritmo matemático FSRS calculará a probabilidade exata de esquecimento de cada palavra com base no histórico individual do estudante.
- **Cartões Interativos Estilo Anki:** No modo "Estudar Agora", o usuário verá cartões com atalhos de teclado (1: Novamente, 2: Difícil, 3: Bom, 4: Fácil). Ao avaliar, verá imediatamente a prévia do próximo intervalo (ex.: "+1 dia", "+4 dias", "+12 dias").
- **Tipos de Cartão Dinâmicos:** Prática por significado, preenchimento de lacunas com frases reais cadastradas, identificação de formas verbais irregulares e associação com contextos da vida real.
- **Gerador Offline de Frases:** Um gerador sintático inteligente que combina verbos, formas irregulares e tempos verbais selecionados para sugerir frases de exemplo gramaticais instantaneamente — sem depender de internet nem de créditos pagos de IA.
- **Quizzes Personalizados e Persistidos:** O estudante poderá criar blocos de estudo sob medida (ex.: "Verbos irregulares de viagem - 10 perguntas"), salvar no seu perfil, jogar quando quiser e acompanhar seu desempenho específico.
- **Prática com Parágrafos e Textos:** O usuário poderá ler pequenos textos ou parágrafos cadastrados e praticar exercícios de lacuna focados exclusivamente nas palavras-alvo contidas naquele texto.

### B. Treino de Fala e Pronúncia (100% Gratuito)
- **Pronúncia Nativa com Síntese de Voz (TTS):** Botão de áudio para escutar qualquer palavra, frase ou significado com voz clara da Web Speech API nativa, podendo configurar sotaque (US/UK) e velocidade de fala.
- **Avaliação de Pronúncia por Reconhecimento de Fala:** O estudante poderá clicar no microfone, falar a palavra ou frase em voz alta e o sistema analisará a fonética, atribuindo uma pontuação de precisão e registrando o histórico na tabela `pronunciation_practice`.

### C. Dashboard e Gamificação Pedagógica
- **Heatmap de Atividade de 365 Dias:** Visualização estilo GitHub com os dias em que o aluno praticou, estimulando a consistência diária.
- **Métricas Reais de Retenção:** Gráficos mostrando a taxa real de retenção de memória por nível CEFR (A1 a C2) e por tempo verbal.
- **Previsão de Carga de Estudo:** Gráfico de previsão mostrando quantas revisões vencerão nos próximos 7 e 30 dias.

### D. Usabilidade e Perfis
- **Alternância Instantânea de Perfil:** Seletor rápido na barra lateral permitindo que irmãos, colegas ou alunos compartilhem o mesmo computador sem misturar nenhum dado.
- **Pacote Inicial Opcional:** Ao criar um estudante novo, o usuário poderá escolher começar do zero ou carregar um "starter deck" com os 50 verbos mais comuns do inglês.
- **Interface Bilíngue:** Um clique no topo da tela alterna toda a interface entre Inglês (`en`) e Português (`pt-BR`).

---

## 6. Diretrizes Mestras para Futuras IAs de Planejamento

Se você é uma IA que foi inicializada ou chamada para trabalhar neste repositório, **siga estas regras estritamente**:

### 1. Protocolo de Abertura de Toda Sessão
Antes de responder ou executar qualquer ação:
1. Leia [`plano-de-acao/RETOMAR.md`](file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/RETOMAR.md) (é a bíblia de conduta diária).
2. Rode `py plano-de-acao/plan_tool.py status` no terminal do Windows para saber onde o projeto parou.
3. Leia o bloco `## PRÓXIMO PASSO` em [`plano-de-acao/PLANO.md`](file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/PLANO.md).
4. Leia o cartão específico da tarefa em [`plano-de-acao/TAREFAS.md`](file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/TAREFAS.md) (procure por `### T-0XX`).
5. Leia os arquivos indicados no campo `Ler:` do cartão (ex.: `ENG`, `CONV`, etc.).

### 2. O Ciclo Inflexível da Tarefa (TDD + Front Incluso)
1. **Marcar Início:** Rode `py plano-de-acao/plan_tool.py start T-0XX`.
2. **Teste Primeiro:** Escreva o teste antes da implementação e execute para vê-lo **falhar** com erro significativo.
3. **Implementação:** Escreva o código estritamente necessário para atender o objetivo do cartão (Back + Front).
4. **Verificação Verde:** Rode a suíte de testes e o lint até passarem 100%.

### 3. A Pausa Obrigatória (O Fim de Toda Sessão)
Toda tarefa executada termina obrigatoriamente com a **PAUSA**:
1. Rodar os testes e o linter.
2. Rodar `py plano-de-acao/plan_tool.py done T-0XX --nota "resumo do que foi feito e validado"`.
3. Rodar `git status` real no terminal.
4. Apresentar um resumo claro ao usuário e sugerir o comando exato de commit em inglês (formato Conventional Commits, ex.: `git add . && git commit -m "feat(study): add Anki-style quiz card (T-067)"`).
5. **NUNCA fazer `push` para o GitHub remoto** (o envio é prerrogativa exclusiva do usuário).
6. **PARAR e aguardar o próximo comando do usuário.**

### 4. Restrições e Travas Técnicas
- **Não altere portas:** Servidor em `3001` e cliente em `5173`.
- **Não instale nada fora da lista D-10:** A lista de dependências aprovadas está em [`plano-de-acao/PLANO.md §Dependências aprovadas`](file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/PLANO.md). Qualquer pacote fora da lista exige decisão formal prévia.
- **Migrations SQL são imutáveis:** Nunca edite um arquivo de migração já aplicado (001 a 009). Qualquer alteração de banco deve ser uma nova migração sequencial (`010_...sql`).
- **Segredos:** Nunca escreva senhas, tokens ou dados reais de conexão no `PLANO.md`, na `LINHA-DO-TEMPO.md`, em commits ou no README.

---

## 7. Mapa Rápido de Decisões do Projeto

| ID | Tema | Padrão Adotado | Status Atual |
|---|---|---|---|
| **D-01** | Posse dos dados | Cada palavra e contexto pertence a **um** estudante | Decidido (V1) |
| **D-02** | Dados existentes | Preservar dados com backup prévio a cada fase | Decidido (2026-10-03) |
| **D-03** | Licença | MIT, `Copyright (c) 2026 mghkill` | Decidido (2026-10-03) |
| **D-04** | Identificação | Cabeçalho `X-Student-Id` + middleware `requireStudent` | Decidido (V1) |
| **D-05** | ORM | Drizzle ORM (+ drizzle-kit para introspecção) | Decidido (2026-10-03) |
| **D-06** | Schema Source | Migrações SQL próprias continuam fonte da verdade | Decidido (2026-10-03) |
| **D-07** | TypeScript | Incremental a partir da Fase 6 (server primeiro) | Decidido (2026-10-03) |
| **D-08** | Idioma do README | pt-BR até Fase 14; vira inglês + pt-BR na Fase 15 | Decidido (2026-10-03) |
| **D-09** | package.json raiz | Apenas para ferramentas e lint/testes compartilhados | Decidido (2026-10-03) |
| **D-10** | Dependências | Lista pré-aprovada em PLANO.md | Decidido (2026-10-03) |
| **D-11** | Docker | Aguardando usuário: instalar antes de T-014 vs não instalar | Aguardando |
| **D-12** | Banco de testes | Banco separado `<DB_NAME>_test` para testes limpos | Proposto |
| **D-13** | Branches | Uma branch por fase (`v2/phase-NN-slug`) | Proposto |
| **D-14** | Algoritmo SRS | FSRS (`ts-fsrs`) moderno substituindo heurística antiga | Proposto (Requer OK antes da Fase 10) |
| **D-15** | Idioma da interface | Detecção automática do navegador com seletor manual | Proposto |
| **D-16** | Planejamento EN | Tradução das pastas e docs de planejamento na Fase 15 | Proposto |
| **D-17** | Linter frontend | Manter Oxlint no client e ESLint só no backend | Proposto |
| **D-18** | Voz | Web Speech API nativa (TTS e Fala), 100% gratuita | Proposto |

---

> **Conclusão:** Este relatório deve ser mantido na raiz de `plano-de-acao/` como a referência mestra conceitual e arquitetural para que qualquer IA conduza o projeto com coerência, segurança e qualidade profissional.
