---
name: melhoria-plano
description: Permite auditar o projeto e melhorar o plano de acao sem tocar no codigo fonte.
---
# SKILL-MELHORIA-PLANO.md
> **Leia este arquivo no início de toda sessão de melhoria.** Ele define o objetivo, o escopo e o ciclo de cada sessão.

---

## Objetivo

Melhorar o planejamento do projeto StudyReviewBlast — arquivos em `plano-de-acao/`, `skills/` e `README.md` da raiz —  
**sem executar nenhuma tarefa T do plano de ação** e sem tocar em código-fonte.

---

## Escopo permitido (em todas as sessões)

### Pode:
- **CRIAR e EDITAR** apenas arquivos `.md` dentro de `plano-de-acao/`, de `plano-de-melhoria/`, de `skills/` e o `README.md` da raiz.
- **LER** qualquer arquivo do projeto (código, configs, migrations) para avaliar e registrar achados.
- Rodar `py plano-de-acao/plan_tool.py status` (somente leitura).
- Rodar `git status` e `git diff --stat` (somente leitura).

### Proibido (sem exceção):
- Alterar código-fonte, testes, migrations, `package.json`, `plan_tool.py`, dependências, banco, portas ou proxy Vite.
- Instalar qualquer pacote ou ferramenta.
- Commitar ou fazer `push`.
- Executar tarefas T do plano de ação.
- Rodar `py plano-de-acao/plan_tool.py start`, `done` ou `log` (só `status`).
- Remover qualquer coisa que já está feita.

### Regras de edição:
- Edite com alterações **pequenas e localizadas** (`str_replace`), não reescreva arquivos inteiros.
- Sempre UTF-8. No PowerShell use `-Encoding UTF8` e confira que acentos não corromperam.
- Novas tarefas entram **sem renumerar** as existentes. Use `add-feature` só com autorização explícita do usuário; caso contrário registre como proposta no `MELHORIA-PLANO.md`.
- Novas decisões usam D-19, D-20...

---

## Ciclo de CADA sessão (siga na ordem exata)

```
1. Ler este arquivo (plano-de-melhoria/SKILL-MELHORIA-PLANO.md).
2. Ler plano-de-melhoria/MELHORIA-PLANO.md inteiro.
3. Se houver M marcada [~] (em andamento):
   a. NÃO começar outra M.
   b. Rodar `git status` e `git diff --stat`.
   c. Verificar o estado do arquivo que ela mexia.
   d. Terminar ou reverter SOMENTE essa M.
4. Pegar a próxima M [ ] (pendente).
5. Escrever no LOG de MELHORIA-PLANO.md: "INÍCIO M-xx — <data/hora>" e marcar [~] ANTES de trabalhar.
6. Executar somente aquela M, uma edição pequena por vez.
7. Ao terminar a M:
   a. Marcar [x] com nota curta.
   b. Escrever no LOG: "FIM M-xx — <data/hora> — arquivos alterados: <lista> — achados: <resumo>".
8. Mostrar resumo ao usuário.
9. Rodar `git status`.
10. Oferecer (mas NÃO executar) o comando de commit na raiz:
    git add .
    git commit -m "docs(plan): <resumo> (M-xx)"
11. PARAR e perguntar: "Continuar com M-yy?"
```

---

## Regra de ouro

**UMA M por sessão.**  
Se terminar cedo, pare mesmo assim.  
Se sentir que o contexto está acabando, **escreva o log ANTES de continuar editando**.

---

## Conflitos e dúvidas

- Registre como **Q-xx** em `plano-de-melhoria/MELHORIA-PLANO.md`.
- Não tome decisões que são prerrogativa do usuário.
- Após a M-07, respeite a hierarquia de documentos definida nela.

---

## Fonte da verdade (ordem de leitura geral do projeto)

Após a M-07, vale a hierarquia definida ali. Antes dela, use:

| Arquivo | Papel |
|---|---|
| `plano-de-acao/RETOMAR.md` | Regras do dia e pausa para execução de Ts |
| `plano-de-acao/PLANO.md` | Fases, decisões D-xx, dependências |
| `plano-de-acao/TAREFAS.md` | Cartões detalhados de cada T |
| `plano-de-acao/LINHA-DO-TEMPO.md` | Histórico cronológico imutável |
| `skills/SKILLENG.md` | Stack, pausa, ambiente |
| `skills/references/convencoes-v2.md` | Padrões de código e commits |

