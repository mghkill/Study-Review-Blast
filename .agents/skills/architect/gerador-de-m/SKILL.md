---
name: gerador-de-m
description: Recebe a intencao do usuario e gera uma tarefa M em plano-de-melhoria/MELHORIA-PLANO.md. Nunca executa a acao diretamente, apenas planeja.
---

# Skill: Gerador de Melhorias (M-Generator)

Esta skill atua como uma barreira de segurança para o projeto. Quando acionada, ela recebe a intenção do usuário, identifica a melhor abordagem (e qual outra skill usar) e gera uma nova tarefa na fila de melhorias.

## Regras Inegociáveis
1. **Nunca execute a intenção diretamente.** Apenas planeje.
2. **Filtro de Autoconsciência (Look Ahead de Skills):** Vasculhe `.agents/skills/`. Se existir uma skill, use-a. Se for padrão novo, gere tarefa para criar a skill.
3. **Gestão de Tokens e Limite de Complexidade (Task Sizing):**
   - **Mensure o impacto:** Quantos arquivos e pastas a tarefa M ou T vai alterar?
   - **Alerta de Sobrecarga:** Se a tarefa planejar modificar **mais de 3 ou 4 arquivos (máximo 5)**, é PROIBIDO executá-la em um único cartão M.
   - **Split Obrigatório:** Apresente um aviso claro de "Risco de Esgotamento de Tokens". Divida automaticamente a demanda em 2 ou mais cartões M menores (ex: M-41a, M-41b).
4. **Priorização Inteligente:** Ao reorganizar filas de Ms ou criar Ts, priorize obrigatoriamente tarefas de **Segurança** e estabilidade estrutural antes de novas features.
5. **Comando de Commit Obrigatório:** Em qualquer planejamento ou fim de sessão, é estritamente obrigatório fornecer a sugestão exata do comando `git add . && git commit -m "..."`.
6. Vá até `plano-de-melhoria/MELHORIA-PLANO.md` e adicione a(s) tarefa(s) na fila com numeração consecutiva (ex: `M-17`).
7. Formato: `- [ ] **M-XX** [Título] — [Explicação, skill acionada e limite de arquivos].`
8. Pare e peça aprovação antes de executar.
