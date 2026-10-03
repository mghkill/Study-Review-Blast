# Como retomar o trabalho — Plano V2

> **Leia este arquivo no início de toda sessão.** Ele é a ponte entre a conversa de hoje e o trabalho feito ontem.

---

## 1. Ordem de leitura obrigatória ao iniciar

1. Este arquivo (`RETOMAR.md`) — regras e fluxo do dia.
2. Bloco `## PRÓXIMO PASSO` em [`PLANO.md`](./PLANO.md) — próxima tarefa.
3. Cartão `### T-0XX` correspondente em [`TAREFAS.md`](./TAREFAS.md) — o que fazer, como testar, critério de pronto.
4. Últimas 20 linhas de [`LINHA-DO-TEMPO.md`](./LINHA-DO-TEMPO.md) — o que a sessão anterior fez.
5. `py plano-de-acao/plan_tool.py status` — confirmar progresso e tarefa atual.

Depois de ler, rode também:
```powershell
git status --short
git log -3 --oneline
```
Se houver tarefa `[~]` em andamento, termine-a antes de começar qualquer outra.

---

## 2. Algoritmo de uma sessão

```
1. ler RETOMAR.md (este arquivo)
2. ler PLANO.md → bloco "PRÓXIMO PASSO"
3. ler TAREFAS.md → cartão da tarefa
4. ler fim de LINHA-DO-TEMPO.md
5. plan_tool.py status
6. git status + git log -3
─────────────────────────────
7. py plano-de-acao/plan_tool.py start T-0XX
8. escrever o teste ANTES e vê-lo FALHAR
9. implementar até o teste passar
10. PAUSA OBRIGATÓRIA (seção 3)
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

## 5. Hierarquia de fontes de verdade

| Arquivo | Para quê |
|---|---|
| `RETOMAR.md` (este) | Regras do dia, pausa, protocolo de retomada |
| `PLANO.md` | Progresso real, fases, decisões D-xx, dependências |
| `TAREFAS.md` | Detalhe de cada tarefa (back, front, teste, pronto) |
| `LINHA-DO-TEMPO.md` | Histórico cronológico (nunca apagar) |
| `plan_tool.py` | Ferramenta operacional (status, start, done, log) |
| `skills/SKILLENG.md` | Regras da skill (stack, pausa, ambiente) |
| `skills/references/modelo-logico-alvo.md` | Schema alvo e migrações |
| `skills/references/diagnostico-atual.md` | Diagnóstico do estado atual |

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

1. Verifique se a tarefa está marcada `[~]` em `PLANO.md` (se não estiver, marque com `start`).
2. Leia o fim de `LINHA-DO-TEMPO.md` para saber até onde chegou.
3. Rode `git status` — se houver arquivos modificados não commitados, avalie se o trabalho parcial está correto antes de continuar.
4. Use o prompt: `Leia plano-de-acao/RETOMAR.md e continue a T-0XX (interrompida).`

---

## 8. Ambiente

- **SO:** Windows. Use `py` (não `python`). PowerShell; caminhos com `/` ou `\\`.
- **Node:** 24 (suporta `--experimental-strip-types` nativamente).
- **PostgreSQL:** 18, local. `pg_dump`/`pg_restore` em `C:\Program Files\PostgreSQL\18\bin\`.
- **Docker:** não instalado (ver D-11 em `PLANO.md`).
- **Fuso horário:** America/Bahia (UTC-3). O `plan_tool.py` cuida das datas; nunca escreva datas à mão.
