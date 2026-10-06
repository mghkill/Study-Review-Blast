---
name: prompt-updater
description: Mantém o arquivo PROMPTS_MESTRES.md atualizado. Sempre que uma nova skill ou fluxo for criado, esta skill deve ser usada para injetar o novo prompt correspondente no catálogo mestre, mantendo a documentação sincronizada.
---

# Skill: Atualizador de Prompts (Prompt Updater)

Esta skill é responsável por garantir que o usuário sempre tenha acesso aos comandos mais recentes e adequados para usar as ferramentas e skills do projeto.

## Regras de Atualização
1. **Identificação:** Leia o arquivo `plano-de-melhoria/PROMPTS_MESTRES.md`.
2. **Nova Entrada:** Crie um título enumerado lógico para a nova skill ou tarefa.
3. **Padrão de Prompt:** O formato de prompt inserido DEVE sempre começar com:
   `Ative a skill gerador-de-m. Minha solicitação é: [Ação que acionará a skill]`
4. **Respeito ao Layout:** Use os blocos de código com formato markdown puro para garantir que o usuário consiga copiar com um clique.
