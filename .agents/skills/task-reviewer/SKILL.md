---
name: task-reviewer
description: Automatiza a revisão de tarefas M e T antes de sua execução, garantindo a injeção e uso adequado de outras skills de agentes para planejamento e segurança.
---

# Skill: Revisor de Tarefas (Task Reviewer)

Esta skill atua como uma barreira de qualidade obrigatória antes da execução de tarefas complexas (M-xx ou T-xx). O objetivo é garantir que o escopo da tarefa seja analisado estruturalmente e que as skills de agentes corretas sejam atreladas ao seu planejamento preventivamente.

## Como Executar a Revisão

1. **Leitura do Escopo:**
   - Leia a tarefa atual no arquivo correspondente (`plano-de-melhoria/MELHORIA-PLANO.md` para tarefas M, ou `plano-de-acao/TAREFAS.md` para tarefas T).

2. **Mapeamento de Agentes (Look-Ahead):**
   - Vasculhe a biblioteca em `.agents/skills/`.
   - Correlacione os objetivos da tarefa com as skills disponíveis.
   - *Exemplos:*
     - Tarefa muda muitos links? -> Injetar `markdown-doctor`.
     - Tarefa toca em rotas/backend? -> Injetar `security-scanner`.
     - Tarefa afeta documentação principal? -> Injetar `hierarchy-sync` ou `readme-open-source`.

3. **Injeção de Inteligência:**
   - Proponha a atualização do cartão da tarefa original (adicionando o bloco "Skills Injetadas" ou modificando a execução prevista).

4. **Pare e Peça Aprovação:**
   - Nunca execute a tarefa T ou M imediatamente após revisá-la. A skill serve apenas para o planejamento e enriquecimento. Apresente o plano enriquecido ao usuário.
