# Plano de Ação — StudyReviewBlast

> **Esta é a fonte da verdade.** Se a conversa for interrompida (limite de tokens, troca de sessão), retome por aqui:
> 1. Leia o bloco "PRÓXIMO PASSO" abaixo e o fim de `LINHA-DO-TEMPO.md`.
> 2. Rode `python plano-de-acao/plan_tool.py status`.
> 3. Continue da tarefa `[~]` (em andamento) ou da primeira `[ ]`. Não replaneje o que já está `[x]`.
>
> Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` feita · `[!]` bloqueada
> Comandos: `start T-000` · `done T-000 --nota "..."` · `block T-000 "motivo"` · `log "mensagem"` · `add-feature "Título" --task "..."`
> Windows: use `py` no lugar de `python` se `python` não funcionar (ex.: `py plano-de-acao/plan_tool.py status`).
> **Nunca escreva senhas, tokens ou o conteúdo do `.env` neste plano.**

## PRÓXIMO PASSO
<!-- proximo:start -->
- Atualizado em 2026-10-01 00:01
- Iniciar **T-005** — Backup do banco com `pg_dump -Fc` fora do repositório; anotar só o caminho do arquivo (sem senha)
<!-- proximo:end -->

## Regras fixas (só mudam se o usuário pedir)
- Banco: **PostgreSQL 18**. Backend: Node + Express + `pg`. Frontend: **React + Vite**.
- `npm run dev` continua iniciando o servidor (porta 3001) e o cliente (porta 5173) como hoje. Não alterar scripts `dev`, portas nem proxy.
- Sem login por enquanto; uso local/offline. Sem serviços externos, sem API de IA paga, sem ORM novo.
- Dependência nova só com justificativa registrada aqui e aprovação do usuário.
- Antes de qualquer migração destrutiva: backup (`T-005`).

## Decisões
| ID | Decisão | Padrão adotado | Situação |
|---|---|---|---|
| D-01 | Posse dos dados | Cada palavra (e seus significados, contextos, frases) pertence a **um** estudante | Proposto — usuário pode vetar |
| D-02 | Dados que já existem no banco | Preservar (clonar para cada estudante que usa a palavra) | Aguardando resposta |
| D-03 | Licença e autor | MIT (já citada no README); nome do autor a confirmar | Aguardando resposta |
| D-04 | Como a API sabe quem é o estudante (sem login) | Cabeçalho `X-Student-Id` validado por middleware | Proposto |

## Fase 0 — Reconhecimento e rede de segurança
- [x] T-001 Ler package.json (raiz, server, client), .env.example, schema.sql, rotas e serviços; confirmar versões reais e anotar divergências com o README ✔ 2026-09-30 23:53
- [x] T-002 Descobrir como o estudante ativo chega à API hoje (contexto React → api.js → rotas) e registrar na linha do tempo ✔ 2026-09-30 23:54
- [x] T-003 Confirmar que `npm run dev` funciona em server/ e client/ (portas 3001 e 5173) antes de qualquer mudança ✔ 2026-09-30 23:57
- [x] T-004 Criar branch de trabalho no git e confirmar árvore limpa ✔ 2026-10-01 00:01
- [ ] T-005 Backup do banco com `pg_dump -Fc` fora do repositório; anotar só o caminho do arquivo (sem senha)
- [ ] T-006 Rodar a suíte atual (server `npm test`; client `npm run test:run` e `npm run lint`) e registrar o baseline
- [ ] T-007 Perguntar ao usuário, em uma única mensagem, D-02 (dados atuais: preservar ou descartar) e D-03 (nome do autor e confirmação da licença MIT)

## Fase 1 — Migrações versionadas (pré-requisito)
- [ ] T-010 Criar `server/src/db/migrations/` e a tabela `schema_migrations` (versão, nome, aplicada_em)
- [ ] T-011 Escrever o executor em Node puro com `pg` (sem dependência nova): aplica .sql em ordem, cada arquivo em transação, pula os já aplicados
- [ ] T-012 Converter o schema.sql atual em `001_baseline.sql` e fazer `npm run migrate` usar o executor (mesmo nome de script)
- [ ] T-013 Testar em banco novo vazio e em cópia do banco existente (restaurada do backup); registrar resultado

## Fase 2 — Isolamento por estudante (prioridade máxima)
- [ ] T-020 Mapear todas as rotas e queries; listar as que não filtram por estudante (tabela no plano)
- [ ] T-021 Escrever ANTES os testes de isolamento (Jest + Supertest) e confirmar que falham hoje (ver references/modelo-logico-alvo.md, seção 3)
- [ ] T-022 Migration 002: `vocabulary_items.student_id` (dono), `UNIQUE(student_id, word, type)` no lugar de `UNIQUE(word, type)`, `UNIQUE(id, student_id)` para chaves compostas
- [ ] T-023 Migrar dados existentes conforme D-02 (clonar palavra + significados + contextos + formas verbais por estudante, remapeando progresso, revisões e erros), em transação, com contagens antes/depois
- [ ] T-024 Chaves estrangeiras compostas `(vocabulary_item_id, student_id)` nas tabelas de progresso e histórico; `student_id` em `contexts` (ver modelo-logico-alvo.md, seção 2)
- [ ] T-025 API: middleware `requireStudent` em todas as rotas; queries filtram por `req.studentId`; ignorar `student_id` vindo do corpo/query; item de outro estudante responde 404
- [ ] T-026 `POST /api/students`: parar de vincular o novo estudante a todo o vocabulário existente (começa vazio)
- [ ] T-027 Cliente: `api.js` envia `X-Student-Id` do estudante ativo; trocar de estudante limpa o estado das telas
- [ ] T-028 Conferir Dashboard, Progresso, fila de revisão, Vocabulário e Banco de Frases: contagens e gráficos só do estudante ativo
- [ ] T-029 Testes de isolamento passando e suíte antiga sem regressão; registrar
- [ ] T-030 Documentar a limitação: sem login isso separa os dados, mas não protege contra quem tem acesso ao app

## Fase 3 — Modelo lógico completo (PostgreSQL 18)
- [ ] T-040 Tabela `tenses` (código, idioma, rótulo, ordem) com os tempos usados na interface; trocar texto livre por chave estrangeira preservando valores existentes
- [ ] T-041 Ajustar CHECK de `study_sessions.session_type` aos modos da tela "Estudar Agora" (+ custom_quiz) e de `sentences.source` para aceitar 'generated'
- [ ] T-042 Tabelas `custom_quizzes` e `custom_quiz_questions` (dono, bloco de 5 ou 10, ordem, enunciado, resposta, palavra, contexto) e `study_sessions.quiz_id`
- [ ] T-043 `language_code` em `vocabulary_items` (padrão 'en') para estudar outras línguas no futuro
- [ ] T-044 Função `set_updated_at()` e gatilhos BEFORE UPDATE nas tabelas com `updated_at`
- [ ] T-045 Índices nas chaves estrangeiras sem índice e índices compostos das consultas quentes (fila de revisão, atividade por data)
- [ ] T-046 Revisar `ON DELETE` (ex.: `reviews.context_practiced` sem regra bloqueia excluir contexto com revisões); garantir exclusão em cascata segura de palavra e de estudante
- [ ] T-047 Gerar `docs/modelo-de-dados.md` com diagrama Mermaid e dicionário de dados
- [ ] T-048 Rodar todas as migrations em banco novo e na cópia do existente; conferir com `\d` que não há divergência

## Fase 4 — Gerador offline de frases
- [ ] T-050 `server/src/services/sentenceGenerator.js`: funções puras (verbo + tempo verbal + sujeito → frase) usando `verb_forms` e regras para verbos regulares
- [ ] T-051 Testes unitários por tempo verbal usado na tela (Present Simple, Past Simple, Present Perfect, Future, Past Continuous, Present Perfect Continuous…), com verbos regulares e irregulares
- [ ] T-052 `POST /api/sentences/generate` (escopo do estudante; devolve sugestões sem gravar)
- [ ] T-053 Interface: botão "Gerar frases" em Detalhes da Palavra e Banco de Frases; usuário aprova/edita antes de salvar (`source='generated'`)
- [ ] T-054 Documentar os limites do gerador (frases simples e gramaticais, nem sempre naturais)

## Fase 5 — Conferência das funcionalidades descritas
- [ ] T-060 Montar a matriz de cobertura (tela × rota × tabela × teste) a partir de references/diagnostico-atual.md; marcar ✅ ⚠️ ❌ conforme o código real
- [ ] T-061 Cada ⚠️/❌ vira tarefa nova com `add-feature`

## Fase 6 — Qualidade
- [ ] T-070 Testes unitários do algoritmo SRS (intervalo, ease_factor, prioridade) e `docs/algoritmo-srs.md`
- [ ] T-071 Erros da API padronizados em JSON, sem vazar SQL
- [ ] T-072 Validação de entrada nas rotas (tipos, tamanhos, valores permitidos) com código simples, sem biblioteca nova
- [ ] T-073 Suíte completa + lint verdes; registrar

## Fase 7 — Pronto para open source
- [ ] T-080 Criar `LICENSE` (MIT, com ano e autor de D-03)
- [ ] T-081 Criar `CONTRIBUTING.md` sob medida (PostgreSQL 18, `npm run dev`, testes, branches e commits)
- [ ] T-082 Conferir `.gitignore` (`.env`, `node_modules`, builds) e `.env.example` completo e sem segredos
- [ ] T-083 Verificar se algum `.env` real já foi commitado (`git log --all -- .env`); se sim, avisar o usuário e trocar a senha
- [ ] T-084 Seeds com dados demonstrativos neutros (perguntar antes de trocar o nome do estudante inicial)
- [ ] T-085 Atualizar o README: PostgreSQL 18 (README diz ≥14), número real de tabelas (README diz 14), novos endpoints, link do modelo de dados, badges só verdadeiros; usar a skill readme-open-source se estiver instalada
- [ ] T-086 Conferir todos os links do README (LICENSE, CONTRIBUTING.md, .env.example, docs/)
- [ ] T-087 (opcional, com aprovação) CODE_OF_CONDUCT.md, SECURITY.md, modelos de issue e de PR

## Fase final — Prova de fogo
- [ ] T-090 Em banco vazio, seguir o README passo a passo como um estranho (clone → install → .env → migrate → seed → `npm run dev`) e confirmar que tudo abre
