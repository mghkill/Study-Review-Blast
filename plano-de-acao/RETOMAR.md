# Como retomar o trabalho — Plano V2

> **Leia este arquivo no início de toda sessão.** Ele é a ponte entre a conversa de hoje e o trabalho feito ontem.

---

## 1. Ordem canônica de leitura ao iniciar

Siga os 6 passos canônicos em ordem estrita (definidos na governança da M-07):

1. [`RELATORIO-GERAL-PROJETO.md`](./RELATORIO-GERAL-PROJETO.md) — ler uma vez no onboarding inicial, ao trocar de modelo de IA ou após compactação de contexto (arquitetura e regras inegociáveis).
2. Este arquivo (`RETOMAR.md`) — ler no início de toda sessão: regras do dia, conduta e verificação de estado.
3. Bloco `## PRÓXIMO PASSO` em [`PLANO.md`](./PLANO.md) — identificar qual é a próxima tarefa T e verificar se há pendências na fase.
4. Cartão `### T-0XX` correspondente em [`TAREFAS.md`](./TAREFAS.md) — ler apenas o bloco da tarefa da sessão (Objetivo, Back, Front, Teste antes, Pronto).
5. Últimas 20 linhas de [`LINHA-DO-TEMPO.md`](./LINHA-DO-TEMPO.md) — entender o contexto imediato deixado pela sessão anterior.
6. Checagem obrigatória no terminal:
   ```powershell
   py plano-de-acao/plan_tool.py status
   git status --short
   git log -3 --oneline
   ```

Se houver tarefa `[~]` em andamento, termine-a ou avalie o estado antes de começar qualquer outra.

---

## 2. Algoritmo de uma sessão

```text
1. ler RELATORIO-GERAL-PROJETO.md (se novo contexto ou troca de IA)
2. ler RETOMAR.md (este arquivo)
3. ler PLANO.md → bloco "PRÓXIMO PASSO"
4. ler TAREFAS.md → cartão exato da tarefa (### T-0XX)
5. ler últimas 20 linhas de LINHA-DO-TEMPO.md
6. py plano-de-acao/plan_tool.py status
7. git status --short + git log -3 --oneline
────────────────────────────────────────────────────────
8. py plano-de-acao/plan_tool.py start T-0XX
9. escrever o teste ANTES e vê-lo FALHAR (TDD obrigatório)
10. implementar até o teste passar
11. PAUSA OBRIGATÓRIA (seção 3)
```

---

## 3. Pausa obrigatória (fim de toda tarefa — sem exceção)

Execute nesta ordem exata e pare após o passo 6:

1. **Rodar os testes e lint:**
   ```powershell
   # No server:
   npm test --prefix server
   # No client:
   npm run test:run --prefix client
   npm run lint --prefix client
   ```
2. **Resumir** em 3–5 linhas o que mudou (o que foi implementado, como foi verificado).
3. **Checar o estado git:**
   ```powershell
   git status
   ```
4. **Oferecer o commit** — sugerir a mensagem em inglês, Conventional Commits, e rodar:
   ```powershell
   git add .        # SEMPRE na raiz do repositório
   git commit -m "tipo(escopo): descrição da tarefa (T-0XX)"
   ```
5. **Não fazer push** — o usuário faz push manualmente.
6. **Atualizar PLANO.md e LINHA-DO-TEMPO.md** e **parar**:
   ```powershell
   py plano-de-acao/plan_tool.py done T-0XX --nota "o que foi feito"
   py plano-de-acao/plan_tool.py status
   ```

> ⚠️ Nunca avance para a próxima tarefa na mesma sessão sem aprovação explícita do usuário.

---

## 4. Prompt diário (copie e cole)

```
Leia plano-de-acao/RETOMAR.md e execute a T-0XX.
```
(Substitua `0XX` pelo número da tarefa mostrado em `PLANO.md → PRÓXIMO PASSO`.)

---

## 5. Hierarquia de autoridade e fontes da verdade (M-07)

A governança do repositório opera em dois regimes: o **Ciclo de Melhoria do Planejamento (Fase M)** e a **Execução Operacional (Fase T)**.

### Matriz de Precedência (Qual arquivo manda em quê)

| Precedência | Documento | Esfera de Autoridade Máxima (Manda em quê) |
|---|---|---|
| **0 (Meta-Regulação Ativa)** | `plano-de-melhoria/SKILL-MELHORIA-PLANO.md` | **Regulação Suprema das Sessões de Melhoria:** Durante as tarefas M, rege o ciclo de sessão, escopo estrito (.md), proibição de tocar em código e regra de 1 M por sessão. |
| **0.1 (Fonte das Melhorias)** | `plano-de-melhoria/MELHORIA-PLANO.md` | **Diretrizes e Decisões de Refinamento:** Consolida achados (F-xx), lacunas (L-xx), decisões do usuário (M-06) e o LOG cronológico das melhorias. |
| **1 (Suprema Operacional)** | [`RELATORIO-GERAL-PROJETO.md`](./RELATORIO-GERAL-PROJETO.md) | **Arquitetura, Visão Alvo e Princípios Cardeais:** Define o que o sistema é e será; regras inegociáveis (100% gratuito/local, isolamento estrito, PostgreSQL 18 soberano); mapa de decisões D-01 a D-18. |
| **2** | [`RETOMAR.md`](./RETOMAR.md) (este arquivo) | **Conduta Operacional e Protocolo de Execução:** Manda no fluxo da sessão diária de desenvolvimento de código, ritual de pausa com `git add .`, verificação prévia e tolerância a falhas de contexto. |
| **3** | [`PLANO.md`](./PLANO.md) | **Sequenciamento das Fases e Dependências Aprovadas:** Manda na ordem das 15 fases, no ponteiro `## PRÓXIMO PASSO`, nas decisões arquiteturais formais D-xx e na lista oficial de dependências autorizadas (D-10). |
| **4** | [`TAREFAS.md`](./TAREFAS.md) | **Especificação Técnica Unitária:** Manda nos requisitos específicos de cada tarefa: critérios de pronto, testes prévios (TDD), escopo de Backend, Frontend, commits convencionais e tamanho (P/M). |
| **5** | [`LINHA-DO-TEMPO.md`](./LINHA-DO-TEMPO.md) | **Histórico Factual e Evidência Auditável:** Registro append-only imutável de todas as ações executadas, timestamps, hashes de backup e conclusões. |
| **6** | `skills/SKILLENG.md` & `skills/references/` | **Padrões Técnicos e Engenharia:** Manda em convenções de branch/commit (`convencoes-v2.md`), modelagem relacional (`modelo-logico-alvo.md`) e padrões open source (`open-source-*.md`). |
| **7** | `README.md` (Raiz) | **Interface com o Usuário e Comunicação Externa:** Manda na experiência do desenvolvedor/usuário final que clona o repositório, instruções de instalação e visualização de progresso. |
| **Histórico** | `plano-de-acao/legado/` | **Museu do Plano V1 (Somente Leitura):** Registro imutável das 26 primeiras tarefas e documentos de transição. Sem autoridade executiva no V2, preservado para auditoria. |

### Ferramenta Operacional (`plan_tool.py`)
- **Operacional única do dia a dia:** `plano-de-acao/plan_tool.py` (usada nos comandos `status`, `start`, `done`, `log`, `block`, `add-feature`).
- **Subcomando obsoleto:** `py plano-de-acao/plan_tool.py init` está **obsoleto e desativado** (não utilizar; plano V2 já estruturado).
- **Cópia espelho de referência:** `skills/scripts/plan_tool.py` mantida intacta na skill.

### Confinamento de `plano-de-melhoria/`
- Espaço oficial de trabalho das melhorias M (`MELHORIA-PLANO.md`, `SKILL-MELHORIA-PLANO.md`, `CENTRAL_IDEA.md`).
- Não é citado em vitrines públicas (`README.md`, `RELATORIO-GERAL-PROJETO.md`).
- Arquivamento histórico em `plano-de-acao/legado/` previsto para o fim da M-15.

---

## 6. Regras inegociáveis

1. **Stack travada:** PostgreSQL 18 · Node + Express · React + Vite. Não trocar.
2. **`npm run dev` não muda:** server porta 3001, client porta 5173. Não alterar scripts, portas nem proxy Vite.
3. **Uma tarefa por sessão.** Pausa obrigatória ao fim (seção 3). Não avançar sem aprovação.
4. **Teste escrito antes** da implementação, visto falhando; só depois implementa.
5. **Nada pago:** sem API de IA paga, TTS premium, Sentry, hospedagem etc. Ideias pagas vão em "Melhorias pós-prova de fogo" no README.
6. **Dependência nova** só da lista aprovada (D-10 em `PLANO.md`); fora dela, nova decisão antes de instalar.
7. **Todo código novo em inglês** (nomes, comentários, commits). Código PT existente é traduzido na Fase 9.
8. **Nunca migração editada:** crie a próxima. Backup antes de migração destrutiva.
9. **Nunca senhas, tokens ou conteúdo do `.env`** no plano, na linha do tempo, no README ou em commits.
10. **`git add .` sempre na raiz** do repositório. A IA não faz `push`.
11. **Branches:** uma por fase (`v2/phase-NN-slug`). Ao fim da fase o usuário abre o PR e faz merge.

---

## 7. Como retomar após troca de IA ou limite de tokens

Se a IA for trocada ou encerrar por falta de tokens no meio de uma tarefa:

1. Se novo contexto ou troca de IA, leia primeiro [`RELATORIO-GERAL-PROJETO.md`](./RELATORIO-GERAL-PROJETO.md) (visão arquitetural).
2. Verifique se a tarefa está marcada `[~]` em `PLANO.md` (se não estiver, marque com `start`).
3. Leia o fim de `LINHA-DO-TEMPO.md` para saber até onde chegou.
4. Rode `git status` — se houver arquivos modificados não commitados, avalie se o trabalho parcial está correto antes de continuar.
5. Use o prompt: `Leia plano-de-acao/RETOMAR.md e continue a T-0XX (interrompida).`

---

## 8. Ambiente

- **SO:** Windows. Use `py` (não `python`). PowerShell; caminhos com `/` ou `\\`.
- **Node:** 24 (suporta `--experimental-strip-types` nativamente).
- **PostgreSQL:** 18, local. `pg_dump`/`pg_restore` em `C:\Program Files\PostgreSQL\18\bin\`.
- **Docker:** Docker Desktop 29.5.2 instalado e em execução (D-11 Decidido; Docker Compose v5.1.3; binário em `C:\Program Files\Docker\Docker\resources\bin`).
- **Fuso horário:** America/Bahia (UTC-3). O `plan_tool.py` cuida das datas; nunca escreva datas à mão.
