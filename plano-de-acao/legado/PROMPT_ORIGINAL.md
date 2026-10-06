Você está na raiz do repositório StudyReviewBlast (React + Vite em `client/`, Node + Express em `server/`, PostgreSQL 18). Uso Windows (PowerShell) e Python 3.14.5 (`py --version`). Você tem acesso total ao meu computador: crie, execute e instale tudo você mesma(o). Só me peça o que depender de mim (decisões — as credenciais e senha do banco estão no `.env`). Responda em português.

## OBJETIVO
Consertar e evoluir o projeto até ficar pronto para open source, seguindo um plano de ação salvo na pasta `plano-de-acao/`, atualizado a cada passo. Já perdi trabalho quando a conversa foi interrompida por limite de tokens; o plano em arquivo é a memória do trabalho.

## CONTEXTO
- Projeto: plataforma para melhorar o estudo de inglês (ou outras línguas) com repetição espaçada (SRS), Active Recall (pistas de contexto, frases com lacuna), quizzes, TTS e painel de desempenho. Hoje está superficial.
- Uso local/offline, SEM login por enquanto. Há vários estudantes e posso criar outros.
- PROBLEMA PRINCIPAL: cada estudante enxerga as palavras de outros. Cada um deve ver e ser avaliado só pelos seus próprios dados e pelo seu próprio monitoramento. Pelo README e pelo schema.sql, a causa provável é: `vocabulary_items` não tem dono (é global), novo estudante é vinculado automaticamente a todo o vocabulário, e `/api/sentences` é um "banco global". Não é um detalhe pequeno: toca schema, migração de dados, rotas e cliente.
- O painel deve receber verbos e gerar pequenas frases e orações simples com tempo verbal (gerador offline, por regras de conjugação, usando `verb_forms`; nada de API externa).
- Telas existentes: Dashboard; Estudar Agora (Sessão Completa, Foco nos Fracos, Consolidação, Manutenção/Fluência, Treino Livre, Quiz Personalizado em blocos de 5 ou 10, filtro CEFR); Vocabulário (busca e filtros, Novo Verbo); Detalhes da Palavra (significados, domínio por tempo verbal, contextos de uso com "Praticar"); Progresso (revisões por semana, erros por categoria, domínio por CEFR, sessões recentes); Prática/Revisão (frase opcional, tempo verbal, avaliação de pronúncia, categorias de erro, observações, botões Difícil/Parcial/Fácil); Banco de Frases.
- REGRAS FIXAS: PostgreSQL 18; Express com `pg`; React + Vite. NÃO alterar `npm run dev` nem as portas 3001 e 5173. Sem ORM, sem serviço externo, sem dependência nova sem me perguntar.
- Open source: não tenho LICENSE nem CONTRIBUTING.md e nunca usei badges. O README atual aponta para ./LICENSE e ./CONTRIBUTING.md. Explique o que são em linguagem simples antes de criar. Licença prevista: MIT (confirmar nome do autor e ano comigo).

## PASSO 1 — Preparar `skills/`
(Atualização: não há mais arquivo zip porque ele se transformou na pasta `skills/` na raiz do projeto, contendo `SKILLENG.md`, `SKILL.md`, e as subpastas `scripts/`, `assets/` e `references/` já prontas e operacionais).
a) Não é mais necessário procurar nem extrair `skills-studyreviewblast.zip`. A estrutura de `skills/` já está presente na raiz.
b) O comando Python no ambiente é `py`.
c) Validação feita via `py skills/scripts/plan_tool.py --help`.

## PASSO 2 — Executar
Leia por completo `skills/SKILLENG.md` e siga-a à risca (leia `skills/references/` só quando a fase pedir). A skill de README, `skills/SKILL.md`, é usada só nas tarefas de README. Se `plano-de-acao/PLANO.md` não existir, rode `<py> skills/scripts/plan_tool.py init`. Se existir, é retomada: leia "PRÓXIMO PASSO" e o fim de `LINHA-DO-TEMPO.md`, rode `status` e continue de onde parou.

Regras de execução:
- Uma tarefa por vez: `start` → executar → verificar (teste ou comando) → `done` com nota. Nunca marque como feita sem evidência. Atualize o plano ANTES e DEPOIS de cada passo; use `log` para decisões, erros e comandos importantes.
- Ao concluir cada tarefa, faça commit local na branch de trabalho, incluindo o plano atualizado (sem push), com mensagem `feat:`, `fix:`, `docs:` ou `chore:`. Se o git não estiver disponível, apenas salve o plano.
- Ao fim de cada tarefa, responda em até 4 linhas: o que mudou, como verifiquei, qual é a próxima.
- Ao fim de cada FASE, pare, resuma e espere eu escrever "continuar".
- Antes de T-023 (migração de dados) e de qualquer comando que apague dados, confirme que o backup de T-005 existe e peça meu OK. O backup usa `pg_dump` (em geral em `C:\Program Files\PostgreSQL\18\bin`).
- Credenciais: leia host, porta, usuário, banco e senha (DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD) do `.env` da raiz. Coloque a senha só na variável de ambiente `PGPASSWORD` da sessão do PowerShell. Nunca imprima, ecoe nem grave a senha no plano, na linha do tempo, em logs, em commits ou na conversa. Antes de T-005, confirme que `.env` está no `.gitignore`; se não estiver, adicione e me avise.
Esta regra vale mais do que o trecho com Read-Host que está em references/modelo-logico-alvo.md.
- T-007: faça as duas perguntas numa única mensagem, com o padrão sugerido (preservar os dados atuais; licença MIT); enquanto eu não responder, avance no que não depende delas.
- Nunca grave senhas ou conteúdo de `.env` no plano, nos logs ou nos commits.
- Se o limite de contexto estiver perto, antes de parar atualize o plano e registre com `log` onde parou e o próximo passo exato.

Comece agora pelos Passos 1 e 2, Fase 0.

## ESPECIFICAÇÕES (só se o zip não existir)

### skills/scripts/plan_tool.py
- Python 3 só com biblioteca padrão; nada de pip. No início, `sys.stdout.reconfigure(encoding="utf-8")` e o mesmo para stderr (console do Windows quebra com acentos e setas). Ler e gravar arquivos sempre em UTF-8.
- Data e hora: fuso America/Bahia via `zoneinfo`; se falhar (Windows costuma não ter tzdata), usar UTC-3 fixo. Formato `YYYY-MM-DD HH:MM`.
- Pasta padrão: a do próprio script, se tiver PLANO.md; senão `./plano-de-acao`. Opção global `--dir`.
- Linha de tarefa: `- [ ] T-001 texto`. Marcas: ` ` pendente, `~` em andamento, `x` feita, `!` bloqueada. `start` acrescenta ` ⏳ data hora`; `done`, ` ✔ data hora`; `block`, ` ⛔ motivo`. Trocar de marca remove o sufixo anterior.
- Fases são títulos `## ` no PLANO.md.
- Comandos: `init` (copia `skills/assets/PLANO.inicial.md` para `plano-de-acao/PLANO.md`, cria `LINHA-DO-TEMPO.md`, copia o próprio script para `plano-de-acao/plan_tool.py`, e nunca sobrescreve); `status` (progresso geral, por fase, em andamento, bloqueadas e próxima); `start ID`; `done ID [--nota]`; `block ID "motivo"`; `log "mensagem"`; `add-feature "Título" --task "..." --task "..."` (acrescenta ao fim do plano `## Funcionalidade adicionada Nº N — Título (em data hora)` com IDs novos continuando do maior T- existente; nunca reescreve o passado).
- `LINHA-DO-TEMPO.md` só recebe linhas no fim: `- **YYYY-MM-DD HH:MM** — texto`.
- Após start, done, block e add-feature, reescrever o bloco entre `<!-- proximo:start -->` e `<!-- proximo:end -->` do PLANO.md com data, a próxima tarefa (primeiro a que estiver `~`, senão a primeira `[ ]`) e as bloqueadas.

### skills/assets/PLANO.inicial.md
Título "Plano de Ação — StudyReviewBlast". Cabeçalho explicando que é a fonte da verdade e como retomar (ler PRÓXIMO PASSO e o fim da linha do tempo, rodar `status`, continuar da `[~]` ou da primeira `[ ]`), legenda, comandos e o aviso de nunca gravar segredos. Depois o bloco `<!-- proximo:start -->`/`<!-- proximo:end -->`, a seção "Regras fixas" (as acima) e a tabela de Decisões: D-01 posse dos dados (cada palavra pertence a um estudante; proposto), D-02 dados existentes (preservar clonando; aguardando), D-03 licença MIT e autor (aguardando), D-04 identificação sem login (cabeçalho `X-Student-Id` validado por middleware; proposto). Depois estas fases e tarefas, exatamente com estes IDs:

Fase 0 — Reconhecimento e rede de segurança
T-001 Ler package.json (raiz, server, client), .env.example, schema.sql, rotas e serviços; confirmar versões reais e anotar divergências com o README
T-002 Descobrir como o estudante ativo chega à API hoje e registrar
T-003 Confirmar que `npm run dev` funciona em server/ e client/ antes de qualquer mudança
T-004 Criar branch de trabalho no git e confirmar árvore limpa
T-005 Backup do banco com pg_dump -Fc fora do repositório; anotar só o caminho
T-006 Rodar a suíte atual (server `npm test`; client `npm run test:run` e `npm run lint`) e registrar o baseline
T-007 Perguntar a D-02 e D-03 numa única mensagem

Fase 1 — Migrações versionadas
T-010 Criar `server/src/db/migrations/` e a tabela `schema_migrations`
T-011 Executor em Node puro com `pg`: aplica .sql em ordem, cada arquivo em transação, pula os já aplicados
T-012 Converter o schema.sql atual em `001_baseline.sql`; `npm run migrate` usa o executor (mesmo nome de script)
T-013 Testar em banco vazio e em cópia do banco existente

Fase 2 — Isolamento por estudante (prioridade máxima)
T-020 Mapear rotas e queries que não filtram por estudante
T-021 Escrever ANTES os testes de isolamento (Jest + Supertest) e ver falharem
T-022 Migration 002: `vocabulary_items.student_id`, `UNIQUE(student_id, word, type)`, `UNIQUE(id, student_id)`
T-023 Migrar dados existentes conforme D-02, em transação, com contagens antes e depois
T-024 Chaves estrangeiras compostas `(vocabulary_item_id, student_id)` nas tabelas de progresso e histórico; `student_id` em `contexts`
T-025 API: middleware `requireStudent`; queries filtram por `req.studentId`; ignorar `student_id` do corpo; item de outro estudante responde 404
T-026 `POST /api/students` não vincula mais todo o vocabulário existente
T-027 Cliente envia `X-Student-Id` do estudante ativo; trocar de estudante limpa o estado
T-028 Conferir Dashboard, Progresso, fila, Vocabulário e Banco de Frases
T-029 Testes de isolamento passando, sem regressão
T-030 Documentar a limitação: sem login separa os dados, mas não protege

Fase 3 — Modelo lógico completo (PostgreSQL 18)
T-040 Tabela `tenses` e chaves estrangeiras no lugar de texto livre
T-041 Ajustar CHECK de `study_sessions.session_type` aos modos da tela (+ custom_quiz) e `sentences.source` para aceitar 'generated'
T-042 Tabelas `custom_quizzes` e `custom_quiz_questions` e `study_sessions.quiz_id`
T-043 `language_code` em `vocabulary_items` (padrão 'en')
T-044 Função `set_updated_at()` e gatilhos
T-045 Índices nas chaves estrangeiras e consultas quentes
T-046 Revisar `ON DELETE` (ex.: `reviews.context_practiced`)
T-047 `docs/modelo-de-dados.md` com diagrama Mermaid e dicionário
T-048 Rodar todas as migrations em banco novo e em cópia do existente

Fase 4 — Gerador offline de frases
T-050 `server/src/services/sentenceGenerator.js` (funções puras)
T-051 Testes unitários por tempo verbal, regulares e irregulares
T-052 `POST /api/sentences/generate` (escopo do estudante; não grava)
T-053 Interface: botão "Gerar frases"; usuário aprova antes de salvar
T-054 Documentar os limites do gerador

Fase 5 — Conferência das funcionalidades descritas
T-060 Matriz de cobertura (tela × rota × tabela × teste)
T-061 Cada lacuna vira tarefa com `add-feature`

Fase 6 — Qualidade
T-070 Testes do algoritmo SRS e `docs/algoritmo-srs.md`
T-071 Erros da API padronizados em JSON, sem vazar SQL
T-072 Validação de entrada nas rotas, sem biblioteca nova
T-073 Suíte completa e lint verdes

Fase 7 — Pronto para open source
T-080 Criar `LICENSE` (MIT, ano e autor de D-03)
T-081 Criar `CONTRIBUTING.md` sob medida
T-082 Conferir `.gitignore` e `.env.example`
T-083 Verificar se algum `.env` real foi commitado (`git log --all -- .env`)
T-084 Seeds neutros (perguntar antes de trocar o nome do estudante inicial)
T-085 Atualizar o README usando `skills/SKILL.md`: PostgreSQL 18 (hoje diz ≥14), número real de tabelas (hoje diz 14), novos endpoints, link do modelo de dados, badges só verdadeiros
T-086 Conferir todos os links do README
T-087 (opcional, com aprovação) CODE_OF_CONDUCT.md, SECURITY.md, modelos de issue e de PR

Fase final — Prova de fogo
T-090 Em banco vazio, seguir o README do zero (clone, install, .env, migrate, seed, `npm run dev`)

### skills/references/
- `diagnostico-atual.md`: divergências README × schema (PostgreSQL ≥14 vs 18; 14 vs 16 tabelas; CHECK de session_type vs modos da tela; LICENSE e CONTRIBUTING possivelmente inexistentes), causas prováveis do vazamento (as acima), riscos do schema (`IF NOT EXISTS` não altera bancos existentes; `updated_at` sem gatilho; FKs sem índice; `reviews.context_practiced` sem ON DELETE; tempo verbal em texto livre; sem tabela de quiz) e matriz tela → tabelas.
- `modelo-logico-alvo.md`: palavra pertence a um estudante; chaves compostas (id, student_id) impedindo mistura no próprio banco; lista de testes de isolamento (B não vê palavra de A, GET/PATCH/DELETE de B em item de A → 404, fila, dashboard e frases só do estudante, estudante novo começa vazio, progresso de B sobre palavra de A falha no banco); middleware com `X-Student-Id` e a limitação sem login; migrações numeradas com executor em Node; novas tabelas; notas de PostgreSQL 18 (IDENTITY nas tabelas novas); desenho do gerador de frases (regras por tempo verbal, irregulares via `verb_forms`, complementos dos contextos cadastrados); backup e restauração em PowerShell.
- `open-source-basico.md`: o que são LICENSE, CONTRIBUTING.md e badges em linguagem simples, e quais arquivos criar, em ordem de importância.

### Arquivos da skill de README (crie só quando chegar em T-085, se faltarem)
- `skills/scripts/detect_stack.py`: lê package.json, lockfile, pyproject/requirements, Dockerfile e docker-compose e imprime tabela Markdown Camada | Tecnologia | Versão | Papel.
- `skills/assets/README.template.md`: esqueleto de README profissional (título, badges, descrição, funcionalidades, tecnologias e versões, pré-requisitos, instalação, configuração, uso, estrutura, testes, roadmap, contribuição, licença).
- `skills/references/open-source-checklist.md`: checklist de arquivos de um projeto open source.