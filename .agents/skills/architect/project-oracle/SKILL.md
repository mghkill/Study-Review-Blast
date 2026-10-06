---
name: project-oracle
description: Atua como buscador central de contexto. Acione esta skill ANTES de responder dúvidas sobre o andamento do projeto, histórico de alterações ou documentação estrutural. Mantém o RELATORIO-GERAL-PROJETO.md sincronizado.
---

# Skill: Oráculo do Projeto (Project Oracle)

Esta skill resolve a perda de contexto. Sempre que o usuário perguntar "o que foi feito?", "onde estão os logs?", "como funciona X?" ou precisar de um resumo geral, você DEVE processar este fluxo antes de responder.

## Fluxo de Busca de Contexto Obrigatório
1. **Histórico de Código:** Leia `plano-de-acao/LINHA-DO-TEMPO.md` (para ver o que foi codificado).
2. **Histórico de Agentes/Arquitetura:** Leia os logs no final de `plano-de-melhoria/MELHORIA-PLANO.md` (para ver as últimas M-xx feitas).
3. **Regras e Estrutura:** Leia `plano-de-acao/RELATORIO-GERAL-PROJETO.md` para ter a arquitetura e decisões D-xx confirmadas.

## Sincronização do Relatório
Se, ao buscar contexto, você perceber que o `RELATORIO-GERAL-PROJETO.md` não cita novas skills criadas na pasta `.agents/skills/` ou novas dinâmicas, aplique uma atualização nele usando a ferramenta de substituição. Nunca deixe o relatório ficar defasado.
