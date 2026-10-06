---
name: gerador-de-m
description: Recebe a intencao do usuario e gera uma tarefa M em plano-de-melhoria/MELHORIA-PLANO.md. Nunca executa a acao diretamente, apenas planeja.
---

# Skill: Gerador de Melhorias (M-Generator)

Esta skill atua como uma barreira de segurança para o projeto. Quando acionada, ela recebe a intenção do usuário, identifica a melhor abordagem (e qual outra skill usar) e gera uma nova tarefa na fila de melhorias.

## Regras Inegociáveis
1. **Nunca execute a intenção diretamente.**
2. Vá até `plano-de-melhoria/MELHORIA-PLANO.md`.
3. Adicione uma nova tarefa na seção "Tarefas de Melhoria" com a numeração consecutiva correta (ex: `M-17`, `M-18`...).
4. A tarefa gerada deve conter o formato:
   `- [ ] **M-XX** [Título] — [Explicação detalhada do que vai fazer, qual skill acionar e arquivos envolvidos].`
5. Pare imediatamente após escrever no arquivo e peça a aprovação do usuário antes de iniciar a execução desta nova tarefa.
