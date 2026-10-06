---
name: dependency-checker
description: Varre a fila de melhorias procurando tarefas não concluídas que contêm tags de bloqueio, validando se a tarefa bloqueadora já foi concluída e atualizando o status.
---

# Skill: Revisor de Dependências (Dependency Checker)

Esta skill resolve gargalos na esteira de melhorias. Muitas tarefas (Ms) recebem tags como `[! Bloqueada até M-XX]`. Com o tempo, as tarefas M-XX bloqueadoras são concluídas, mas as tags não são removidas, deixando a tarefa "órfã" e travada infinitamente.

## Como Executar a Verificação

1. **Leitura da Fila:**
   - Acesse o arquivo de plano (geralmente `plano-de-melhoria/MELHORIA-PLANO.md`).
   - Identifique todas as tarefas pendentes (`[ ]` ou `[~]`).

2. **Detecção de Bloqueios:**
   - Varra as tarefas pendentes procurando padrões de bloqueio (ex: `[! Bloqueada até M-14]`, `[ADIADA]`).

3. **Validação:**
   - Para cada bloqueio encontrado, verifique o status da tarefa bloqueadora referenciada.
   - Se a tarefa bloqueadora (ex: M-14) estiver concluída (`[x]`), a tarefa bloqueada está livre para execução.

4. **Desbloqueio e Atualização:**
   - Modifique o texto do cartão, removendo a tag de bloqueio ou adicionando uma nota `[LIVRE]`.
   - Crie uma lista (relatório) informando ao usuário exatamente quais tarefas foram destravadas.

5. **Pare e Peça Autorização:**
   - Apresente o relatório. Sugira que o plano atualizado seja salvo (commit).
