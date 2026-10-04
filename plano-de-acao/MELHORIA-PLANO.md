# Plano de Melhoria do Planejamento — StudyReviewBlast

> Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` feita · `[!]` bloqueada

---

## PRÓXIMO PASSO

Cole o Prompt B para iniciar a **M-01**.

---

## Achados (F-xx)

> Achados identificados durante as tarefas M. Preenchido a partir da M-01.

---

## Lacunas do legado (L-xx)

> Lacunas encontradas na migração V1→V2. Preenchido a partir da M-04.

---

## Perguntas para o usuário (Q-xx)

> Conflitos, ambiguidades e decisões pendentes que requerem resposta do usuário. Não avançar sem resposta.

---

## Tarefas de Melhoria

### Fase M1 — Varredura (somente leitura)

- [ ] **M-01** Inventário — Listar todos os `.md` e `.py` de `plano-de-acao/`, `skills/`, raiz e `legado/` com tamanho e função; classificar ATIVO / LEGADO / HISTÓRICO; apontar duplicações e arquivos órfãos (inclua `migrations/README.md`: tem função? sugerir manter ou remover, sem remover).
  - Lê: raiz, `plano-de-acao/`, `plano-de-acao/legado/`, `skills/`, `skills/references/`, `skills/assets/`, `skills/scripts/`
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (seção Achados F-xx)

- [ ] **M-02** Verdade no disco — Conferir `plan_tool.py status`; contar cartões em `TAREFAS.md` (esperado 94, T-001 a T-094, sem faltar nem repetir); campos obrigatórios por cartão (objetivo, back, front, teste antes, pronto, tamanho P/M, prompt, pausa); conferir cada afirmação do RELATORIO-GERAL (§2 árvore vs disco, §3 estado, migrations 001–009 existem); verificar se `plan_tool.py init` depende de `skills/assets/PLANO.inicial.md` (só relatar).
  - Lê: `plano-de-acao/TAREFAS.md`, `plano-de-acao/RELATORIO-GERAL-PROJETO.md`, `plano-de-acao/plan_tool.py`, `server/src/db/migrations/`
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (seção Achados F-xx)

- [ ] **M-03** Conformidade com `PROMPT_INICIAL_LEGADOV2.md` e `PROMPT_ORIGINAL.md` — checklist R-01..R-16 abaixo, cada um ✅/⚠️/❌ com evidência (arquivo e linha).
  - Lê: `plano-de-acao/legado/PROMPT_INICIAL_LEGADOV2.md`, `plano-de-acao/PROMPT_ORIGINAL.md`, `plano-de-acao/PLANO.md`, `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (seção Achados F-xx)

- [ ] **M-04** Auditoria do legado — Para cada tarefa de `legado/PLANO-v1.md` (T-001 a T-090, inclusive opcionais), confirmar que o destino em `legado/MAPA-V1-V2.md` existe em `TAREFAS.md` com conteúdo real (não só título) e, para as marcadas concluídas, que há evidência no disco. Tudo sem destino ou sem evidência vira L-xx.
  - Lê: `plano-de-acao/legado/PLANO-v1.md`, `plano-de-acao/legado/MAPA-V1-V2.md`, `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (seção Lacunas L-xx)

- [ ] **M-05** Auditoria de código (SOMENTE LEITURA) — SQL montado por concatenação/interpolação de strings; rotas sem validação de entrada; erros que vazam SQL; testes quebrados (client srs/tts, server status red→yellow) e se alguma T cuida deles; extensão pgcrypto sem uso; textos/comentários em português e acentos corrompidos; `console.log`. Resultado: achados F-xx com arquivo:linha. Não alterar código.
  - Lê: `server/src/`, `client/src/`, testes em ambos
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (seção Achados F-xx)

### Fase M2 — Decisões e consistência

- [ ] **M-06** Consolidar pendências — Reunir TODAS as pendências em UMA única pergunta, cada uma com recomendação para o usuário responder "ok" ou trocar: D-11 (Docker), D-12 a D-18, lista D-10 incompleta (ts-fsrs, Playwright, libs de OpenAPI e cobertura), voz vs princípio "100% local" (reconhecimento de fala no Chrome envia áudio ao Google), e quaisquer Q-xx. Depois PARAR e esperar resposta do usuário. **[! Bloqueada até M-05 concluída]**
  - Lê: `plano-de-acao/PLANO.md`, `plano-de-acao/MELHORIA-PLANO.md` (todos os Q-xx e F-xx)
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (seção Q-xx)

- [ ] **M-07** Hierarquia de documentos — Definir qual arquivo manda em quê e a ORDEM ÚNICA de leitura (sugestão: RELATORIO-GERAL → RETOMAR → PLANO → cartão em TAREFAS); marcar `legado/` como somente leitura; listar links absolutos `file:///c:/...` a trocar por relativos. **[! Bloqueada até M-06 respondida]**
  - Lê: todos os `.md` de `plano-de-acao/` e `skills/`
  - Altera: `plano-de-acao/MELHORIA-PLANO.md`

### Fase M3 — Aplicação nos .md (um arquivo por M; só depois da M-06 respondida)

- [ ] **M-08** `PLANO.md` — Atualizar situação das decisões; estender D-10 com o aprovado; incluir novas T como propostas (F-xx e L-xx), incluindo T para auditar/eliminar SQL por concatenação antes do ORM e T para as falhas de teste conhecidas. **[! Bloqueada até M-06 respondida]**
  - Lê: `plano-de-acao/PLANO.md`, `plano-de-acao/MELHORIA-PLANO.md`
  - Altera: `plano-de-acao/PLANO.md`

- [ ] **M-09** `TAREFAS.md` — Cartões das T novas e correções pontuais nos cartões afetados. **[! Bloqueada até M-08]**
  - Lê: `plano-de-acao/TAREFAS.md`, `plano-de-acao/MELHORIA-PLANO.md`
  - Altera: `plano-de-acao/TAREFAS.md`

- [ ] **M-10** `RETOMAR.md` — Alinhar à hierarquia da M-07. **[! Bloqueada até M-07]**
  - Lê: `plano-de-acao/RETOMAR.md`
  - Altera: `plano-de-acao/RETOMAR.md`

- [ ] **M-11** `RELATORIO-GERAL-PROJETO.md` — Trocar links absolutos por relativos; ajustar §5B (voz) conforme decisão do usuário; corrigir "100% TS strict" vs D-07 (incremental). **[! Bloqueada até M-06 respondida]**
  - Lê: `plano-de-acao/RELATORIO-GERAL-PROJETO.md`
  - Altera: `plano-de-acao/RELATORIO-GERAL-PROJETO.md`

- [ ] **M-12** Skills — Alinhar `skills/SKILLENG.md`, `skills/references/convencoes-v2.md` e `skills/skill.md` à hierarquia da M-07. **[! Bloqueada até M-07]**
  - Lê: `skills/SKILLENG.md`, `skills/references/convencoes-v2.md`, `skills/skill.md`
  - Altera: os arquivos listados conforme necessário

- [ ] **M-13** `README.md` da raiz — Alinhar (onde parei, decisões em linguagem simples, melhorias pós-prova de fogo, observação de tradução para inglês na Fase 15). **[! Bloqueada até M-06 respondida]**
  - Lê: `README.md`
  - Altera: `README.md`

- [ ] **M-14** Legado — Corrigir `legado/MAPA-V1-V2.md` e `legado/RELATORIO-RECONSTRUCAO-V2.md`: correções do mapa (linha V1 T-001; faixas da tabela "100% novas" por listas exatas) e das lacunas L-xx. **[! Bloqueada até M-04]**
  - Lê: `plano-de-acao/legado/MAPA-V1-V2.md`, `plano-de-acao/legado/RELATORIO-RECONSTRUCAO-V2.md`, `plano-de-acao/MELHORIA-PLANO.md` (L-xx)
  - Altera: `plano-de-acao/legado/MAPA-V1-V2.md`, `plano-de-acao/legado/RELATORIO-RECONSTRUCAO-V2.md`

- [ ] **M-15** Verificação final — Repetir M-02; checar links; `plan_tool.py status`; `git status`; registrar que o planejamento está pronto; entregar o prompt exato para iniciar T-001; propor arquivar `MELHORIA-PLANO.md` em `legado/`. **[! Bloqueada até M-08 a M-14]**
  - Lê: todos os `.md` modificados
  - Altera: `plano-de-acao/MELHORIA-PLANO.md` (LOG final)

---

## Checklist de requisitos (para a M-03)

| Código | Requisito |
|---|---|
| R-01 | Reaproveita o plano V1 e preserva o histórico em `legado/` |
| R-02 | Tarefas pequenas (P ou M), uma por sessão |
| R-03 | Todo T inclui o front (ou justificativa) |
| R-04 | Teste escrito antes e visto falhando |
| R-05 | Pausa em todo T com `git add .` na raiz, sem push, commit em inglês convencional |
| R-06 | Nada pago no plano (ideias pagas só em "Melhorias pós-prova de fogo" no README) |
| R-07 | ORM + qualidade (lint, hooks, CI, Zod, segurança, logs) e proteção contra SQL injection |
| R-08 | Tradução total para inglês planejada e não executada, com i18n |
| R-09 | Estudo estilo Anki + repetição espaçada + dashboard + voz gratuita |
| R-10 | README da raiz como guia mestre (onde parei, algoritmo do dia, prompt por T, decisões em linguagem simples, melhorias pós-T-090) |
| R-11 | `RETOMAR.md` é o ponto de entrada diário e funciona ao trocar de modelo de IA |
| R-12 | READMEs sem função de `client/` e `server/` removidos |
| R-13 | Prova de fogo final |
| R-14 | Dependências só da lista aprovada, e essa lista cobre TODAS as fases |
| R-15 | Portas, proxy e scripts dev intactos, salvo D-07 e D-09 |
| R-16 | Nenhum segredo nos documentos |

---

## LOG (append-only — nunca apagar linhas)

```
[2026-10-03 21:09] INÍCIO M-00 (criação do plano de melhoria)
[2026-10-03 21:09] FIM M-00 — Arquivos criados: skills/SKILL-MELHORIA-PLANO.md, plano-de-acao/MELHORIA-PLANO.md
                   Passo 1 (reconhecimento leve):
                   - Branch atual: v2/phase-01-safety-net
                   - plan_tool.py status: 4/94 (4%) — PRÓXIMA: T-002
                   - git status: working tree clean (sem arquivos modificados não commitados)
                   - Estrutura: plano-de-acao/ (7 arquivos + legado/ com 6), skills/ (2 md + 3 subpastas), raiz (README.md, .env, .gitignore, migrate_session_type.js)
                   - Achados preliminares (sem M formal): links absolutos em RELATORIO-GERAL §4 e §6; RELATORIO-GERAL §5B menciona "análise fonética" via Web Speech API (possível conflito com princípio 100% local); D-10 não lista ts-fsrs, Playwright, libs OpenAPI/cobertura; D-11 a D-18 pendentes; 8 documentos de planejamento sem hierarquia clara definida; migrations/README.md existe.
```
