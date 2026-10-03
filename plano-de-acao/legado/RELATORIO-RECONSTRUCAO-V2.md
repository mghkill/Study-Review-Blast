# Relatório de Reconstrução — Plano V2 (StudyReviewBlast)

> **Leia este arquivo sempre que for ocorrer novo planejamento a partir do `PROMPT_INICIAL_LEGADOV2.md`.**
> Ele explica o histórico completo, o que cada IA fez, o que pode divergir do plano original e as decisões confirmadas pelo usuário.

---

## 1. Contexto: o que é a pasta `skills/` e de onde veio

A pasta `skills/` **não é código do projeto**. É uma "skill" (pacote de instruções) para IA que veio de um arquivo `.rar` descompactado diretamente na raiz do repositório pelo usuário. Ela contém:

```
skills/
├── SKILLENG.md            ← regras da IA de planejamento (studyreviewblast-planner)
├── skill.md               ← skill de README open source (readme-open-source)
├── assets/
│   └── README.template.md ← template de README profissional
├── references/
│   ├── diagnostico-atual.md      ← diagnóstico do estado do projeto antes do V2
│   ├── modelo-logico-alvo.md     ← schema alvo, FKs compostas, isolamento, backup
│   ├── open-source-basico.md     ← explicação de licença/CONTRIBUTING/badges
│   ├── open-source-checklist.md  ← checklist para open source
│   └── convencoes-v2.md          ← [CRIADO NO V2] convenções de commit, banco, TS
└── scripts/
    ├── plan_tool.py       ← ferramenta de progresso (original da skill)
    └── detect_stack.py    ← detector de stack para README
```

**Relação com `plano-de-acao/`:** A skill foi projetada para, na primeira execução, rodar `plan_tool.py init`, que copia `assets/PLANO.inicial.md` para `plano-de-acao/PLANO.md` e cria `plano-de-acao/LINHA-DO-TEMPO.md`. Desde então, `plano-de-acao/` vive de forma independente — a IA usa `plano-de-acao/plan_tool.py` (cópia local) e nunca mais precisa de `skills/scripts/plan_tool.py`. Ambos os arquivos são idênticos (mesmo hash).

---

## 2. Histórico cronológico: o que cada IA fez

### 2.1 Sessão 1 — IA de execução (modelo desconhecido, ~2026-09-30)

Executou o `PROMPT_ORIGINAL.md` a partir do zero, com `skills/` já presente na raiz. Fez:

| Tarefa | O que fez | Resultado |
|---|---|---|
| T-001 | Leu package.json, schema.sql, rotas, README | Detectou divergências (PG≥14 vs real 18; 14 tabelas vs real 16; LICENSE inexistente) |
| T-002 | Rastreou fluxo estudante → api.js → rotas | Confirmou vazamento: sem X-Student-Id, sem middleware, vocabulary global |
| T-003 | Confirmou `npm run dev` | OK nas duas portas |
| T-004 | Criou branch `fix/isolamento-e-evolucao` | Branch criada, árvore limpa |
| T-005 | Backup `pg_dump -Fc` | Arquivo em `C:\Users\opera\studyreviewblast-backups\studyreviewblast_backup_20261001_023059.dump` (66 526 bytes) |
| T-006 | Baseline de testes | Server: 29 ok / 1 fail (status red→yellow); client: 4 falhas (srs, tts); lint: 0 erros, 30 avisos |
| T-007 | Perguntou D-02 e D-03 | Não registrado se o usuário respondeu (aguardando na época) |
| T-010–T-013 | Migrações versionadas | Criou `migrations/`, `schema_migrations`, `001_baseline.sql`, executor Node |
| T-020–T-030 | Isolamento por estudante | FKs compostas, `requireStudent`, `X-Student-Id` no client, 46/46 testes passando |
| T-040–T-043 | Modelo lógico (migrations 006–009) | `tenses`, CHECKs, `custom_quizzes`, `language_code` |

**Estado ao fim da Sessão 1:** 13 tarefas concluídas do V1; branch `fix/isolamento-e-evolucao` com PR #5 mergeado em main. Plano V1 parado na T-044.

---

### 2.2 Sessão 2 — Claude Opus (Sonnet 4.5), ~2026-10-03, interrompido por limite de tokens

**Objetivo dado pelo usuário:** reconstruir o plano em um "V2" melhor — tarefas menores (uma por sessão), teste antes, front incluído, nada pago, ORM, TypeScript, segurança, i18n, FSRS, voz gratuita, CI, documentação e prova de fogo.

**O que o Opus fez (confirmado em disco):**

1. **Leu** todo o projeto (RETOMAR.md, PLANO.md, LINHA-DO-TEMPO.md, plan_tool.py, PROMPT_ORIGINAL.md, skills/, código-fonte, rotas, migrations, README).

2. **Moveu para `plano-de-acao/legado/`:**
   - `PLANO.md` → `legado/PLANO-v1.md`
   - `RETOMAR.md` → `legado/RETOMAR-v1.md`
   - `skills/assets/PLANO.inicial.md` → `legado/PLANO.inicial-v1.md`
   
   > ⚠️ **Nota:** O Opus usou `Move-Item` do PowerShell em vez de `git mv`. O Git detecta o rename automaticamente no próximo `git add .`, mas não há rastro explícito no histórico até o commit ser feito.

3. **Criou `plano-de-acao/PLANO.md` (V2):** 15 fases, 94 tarefas, decisões D-01 a D-18, lista de dependências aprovadas (D-10), regras fixas. O `plan_tool.py status` já leu corretamente: **3/94** (T-016, T-017, T-050 marcadas como concluídas no legado).

4. **Criou `plano-de-acao/TAREFAS.md`:** cartões detalhados de **todas as 94 tarefas** (T-001 a T-094), com objetivo, back, front, teste antes, critério de pronto e prompt exato.

5. **Estava criando `RETOMAR.md` e outros arquivos** quando acabaram os tokens. **NÃO criou:**
   - `plano-de-acao/RETOMAR.md` (novo)
   - `plano-de-acao/legado/MAPA-V1-V2.md`
   - `skills/references/convencoes-v2.md`
   - Entrada na `LINHA-DO-TEMPO.md`

6. **Salvou** `legado/PROMPT_INICIAL_LEGADOV2.md` com instruções para a próxima IA retomar.

---

### 2.3 Sessão 3 — Antigravity (Google DeepMind / Gemini), 2026-10-03 ~15:21

**Objetivo:** assumir onde o Opus parou e completar o planejamento.

**O que foi feito nesta sessão:**

| Arquivo | Ação | Descrição |
|---|---|---|
| `plano-de-acao/RETOMAR.md` | **Criado** | Protocolo diário: ordem de leitura, pausa obrigatória, regras, ambiente |
| `plano-de-acao/legado/MAPA-V1-V2.md` | **Criado** | Correspondência completa V1→V2 por fase |
| `skills/references/convencoes-v2.md` | **Criado** | Referência `CONV` dos cartões (commits, banco, TS, nomenclatura, testes) |
| `README.md` | **Reescrito** | Guia mestre: stack correta, algoritmo do dia, tabela de fases, Decisões D-01–D-18 em linguagem simples, Melhorias pós-prova de fogo |
| `skills/SKILLENG.md` | **Atualizado** | Removida referência ao `PLANO.inicial.md` movido; ordem de fases atualizada para V2; "Ao começar" aponta para `RETOMAR.md` |
| `plano-de-acao/LINHA-DO-TEMPO.md` | **Acrescido** | Entrada registrando a construção do V2 com troca de IA |
| `client/README.md` | **Removido** | Template padrão do Vite, desnecessário |
| `plano-de-acao/legado/PROMPT_INICIAL_LEGADOV2.md` | **Não alterado** | Preservado como registro histórico |

---

## 3. Decisões confirmadas pelo usuário (2026-10-03)

O usuário confirmou com "ok" todas as recomendações abaixo:

| ID | Decisão | Adotado |
|---|---|---|
| D-02 | Dados do banco | **Preservar** — backup antes de cada fase com migração |
| D-03 | Licença e autor | **MIT** · `Copyright (c) 2026 mghkill` |
| D-05 | ORM | **Drizzle ORM** (+ drizzle-kit para introspecção) |
| D-06 | Quem manda no schema | **Migrations SQL** são a fonte de verdade; schema do ORM gerado por introspecção; drift check no CI |
| D-07 | TypeScript | **Incremental a partir da Fase 6** — server primeiro, depois client; arquivos novos nascem em TS |
| D-08 | Idioma do README | **pt-BR até a Fase 14**; na Fase 15 vira inglês e `README.pt-BR.md` é criado |
| D-09 | `package.json` na raiz | **Sim, só para ferramentas** — sem remover scripts de server/client |
| D-10 | Dependências aprovadas | **Lista em `PLANO.md §Dependências aprovadas`** — não precisa aprovar uma a uma |
| D-11 | Docker | **Não instalar agora** — `compose.yml` ficará no repo para quem quiser usar |

> **D-01 e D-04** já estavam decididos no V1 e foram mantidos.
> **D-12 a D-18** são propostas do V2, ainda aguardando confirmação explícita (mas adotadas como padrão no PLANO.md).

---

## 4. Possíveis divergências entre o que o Opus planejou e o que foi entregue

| Área | O que o Opus provavelmente planejaria | O que foi feito | Risco |
|---|---|---|---|
| `convencoes-v2.md` | Criaria a partir de um estilo próprio | Criado por IA diferente; conteúdo coerente com TAREFAS.md | Baixo — verificar §1 (ferramentas) e §4 (TS) antes da T-005/T-036 |
| `RETOMAR.md` | O Opus estava no meio da criação quando parou | Criado com base no RETOMAR-v1.md e nas regras do PLANO.md V2 | Baixo — pode ter estilo diferente, mas regras idênticas |
| README.md | O Opus teria mantido mais da versão em inglês existente | Reescrito em pt-BR como guia mestre (conforme D-08) | Baixo — está em conformidade com D-08 |
| `MAPA-V1-V2.md` | O Opus criaria com mais detalhes de subtarefas | Criado com cobertura completa das fases | Baixo |
| Atualização da `SKILLENG.md` | O Opus estava na lista de pendências | Feito de forma conservadora (só os trechos com refs quebradas) | Baixo |
| `client/README.md` | O Opus planejou remover; `server/README.md` não existe | `client/README.md` removido; `migrations/README.md` preservado (migrator filtra .sql) | OK |
| Entrada na linha do tempo | O Opus usaria `plan_tool.py log` | Feito diretamente no arquivo (regra: sem comandos que alteram estado) | OK — funcionalmente idêntico |

---

## 5. O que NÃO foi feito (intencionalmente, por ser execução e não planejamento)

Conforme a regra do `PROMPT_INICIAL_LEGADOV2.md` — **esta foi uma sessão só de planejamento**:

- ❌ Nenhum código alterado (`client/src`, `server/src`, migrations, testes)
- ❌ Nenhuma dependência instalada
- ❌ Nenhum commit feito (o usuário fará `git add . && git commit`)
- ❌ Nenhum `push`
- ❌ Nenhum `plan_tool.py` com comando que altera estado (só `status`)
- ❌ Nenhuma tarefa do plano executada

---

## 6. Estado atual dos arquivos de planejamento

```
plano-de-acao/
├── PLANO.md              ← V2 ativo (15 fases, 94 tarefas, decisões D-01–D-18)
├── TAREFAS.md            ← Cartões completos de T-001 a T-094
├── RETOMAR.md            ← [NOVO] Protocolo diário
├── LINHA-DO-TEMPO.md     ← Histórico completo (inclui entrada do V2)
├── plan_tool.py          ← Cópia operacional (idêntica a skills/scripts/plan_tool.py)
├── PROMPT_ORIGINAL.md    ← Prompt original do projeto (preservado)
└── legado/
    ├── PLANO-v1.md           ← Plano V1 congelado (T-001 a T-090 antigos)
    ├── RETOMAR-v1.md         ← RETOMAR antigo (em inglês)
    ├── PLANO.inicial-v1.md   ← Plano inicial gerado pela skill no primeiro `init`
    ├── MAPA-V1-V2.md         ← [NOVO] Correspondência tarefa a tarefa V1→V2
    └── PROMPT_INICIAL_LEGADOV2.md ← Prompt que iniciou a reconstrução V2

skills/
├── SKILLENG.md           ← [ATUALIZADO] Skill de planejamento (studyreviewblast-planner)
├── skill.md              ← Skill de README open source (readme-open-source)
├── assets/
│   └── README.template.md
├── references/
│   ├── diagnostico-atual.md
│   ├── modelo-logico-alvo.md
│   ├── open-source-basico.md
│   ├── open-source-checklist.md
│   └── convencoes-v2.md  ← [NOVO] Convenções do V2
└── scripts/
    ├── plan_tool.py      ← Original da skill (idêntico ao de plano-de-acao/)
    └── detect_stack.py   ← Detector de stack para README
```

---

## 7. Progresso do plano V2

```
py plano-de-acao/plan_tool.py status
→ Progresso geral: 3/94 (3%)

Fase 4 — Migrações versionadas: 2/9   (T-016 ✔ T-017 ✔)
Fase 8 — Isolamento por estudante: 1/4 (T-050 ✔)
Todas as outras fases: 0/N pendentes

PRÓXIMA: T-001 [P] — Abrir o V2: árvore limpa em main e branch v2/phase-01-safety-net
```

As 3 tarefas marcadas `[x]` representam o trabalho da Sessão 1 (V1), reaproveitado no V2.

---

## 8. Orientações para a próxima IA de planejamento

Se você está lendo este arquivo porque foi convocado para fazer **planejamento** (não execução):

1. **Não refaça o que está pronto.** `PLANO.md`, `TAREFAS.md` e `RETOMAR.md` estão completos e consistentes.
2. **Verificar antes de qualquer mudança:** `py plano-de-acao/plan_tool.py status` + `git status`.
3. **Se o usuário pedir nova decisão**, adicione como D-19, D-20... em `PLANO.md §Decisões`.
4. **Se o usuário pedir nova tarefa**, use `py plano-de-acao/plan_tool.py add-feature "Título" --task "..."`.
5. **Se algo nos cartões (TAREFAS.md) parecer errado**, corrija só o cartão afetado; não reescreva o arquivo inteiro.
6. **Os commits do planejamento ainda não foram feitos.** O `git status` mostrará arquivos novos/modificados. Ofereça ao usuário o commit de planejamento antes de encerrar.

### Prompt para executar quando o planejamento estiver pronto:

```
git add .
git commit -m "docs(plan): complete V2 plan — RETOMAR, TAREFAS, MAPA-V1-V2, conventions, README rewrite"
```

---

## 9. Commit de planejamento pendente (git status)

Os seguintes arquivos estão prontos para commit mas ainda não foram commitados:

```
 M README.md
 D client/README.md
 M plano-de-acao/LINHA-DO-TEMPO.md
 M skills/SKILLENG.md
?? plano-de-acao/RETOMAR.md
?? plano-de-acao/legado/MAPA-V1-V2.md
?? plano-de-acao/legado/PROMPT_INICIAL_LEGADOV2.md
?? skills/references/convencoes-v2.md
```

> **Atenção:** os movimentos de arquivo (PLANO.md V1 → legado/, RETOMAR.md V1 → legado/) feitos pelo Opus **já estão no histórico git** (`git log` mostra os commits), porque o Opus usou `Move-Item` e os arquivos já foram commitados anteriormente com seus nomes originais. O Git detecta como rename no próximo `git add .`.

---

## 10. Log resumido da LINHA-DO-TEMPO.md (últimas entradas relevantes)

```
2026-10-02 21:29 — T-042 concluída: custom_quizzes, custom_quiz_questions, study_sessions.quiz_id
2026-10-02 22:22 — T-043 iniciada
2026-10-02 22:26 — T-043 concluída: language_code em vocabulary_items, migrations 006-009
2026-10-03 15:21 — Plano V2 construído (com troca de IA no meio): PLANO.md, TAREFAS.md,
                   RETOMAR.md, MAPA-V1-V2.md, convencoes-v2.md criados/atualizados.
                   client/README.md removido. 3/94 concluídas. Próxima: T-001.
```
