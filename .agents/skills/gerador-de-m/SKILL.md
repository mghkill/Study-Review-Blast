---
name: gerador-de-m
description: Recebe a intencao do usuario e gera uma tarefa M em plano-de-melhoria/MELHORIA-PLANO.md. Nunca executa a acao diretamente, apenas planeja.
---

# Skill: Gerador de Melhorias (M-Generator)

Esta skill atua como uma barreira de segurança para o projeto. Quando acionada, ela recebe a intenção do usuário, identifica a melhor abordagem (e qual outra skill usar) e gera uma nova tarefa na fila de melhorias.

## Regras Inegociáveis
1. **Nunca execute a intenção diretamente.**
2. **Filtro de Autoconsciência (Look Ahead de Skills):** Antes de planejar, vasculhe a pasta `.agents/skills/`.
   - Se já existir uma skill que resolve o pedido, incorpore-a no planejamento do M (não invente a roda).
   - Se NÃO existir, avalie a natureza do pedido: Se for um padrão repetitivo ou arquitetural, gere a tarefa focada na **criação de uma nova skill**. Se for um bug pontual, crie a tarefa normal de execução.
3. Vá até `plano-de-melhoria/MELHORIA-PLANO.md`.
4. Adicione uma nova tarefa na seção "Tarefas de Melhoria" com a numeração consecutiva (ex: `M-17`).
5. A tarefa gerada deve conter o formato:
   `- [ ] **M-XX** [Título] — [Explicação detalhada, skill a ser acionada e arquivos].`
6. Pare imediatamente e peça a aprovação do usuário antes de iniciar a execução desta nova tarefa.
