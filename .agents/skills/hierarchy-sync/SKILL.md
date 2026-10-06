---
name: hierarchy-sync
description: Garante que as documentações do projeto sejam atualizadas em cascata estrutural (Logs -> Relatório -> README) para evitar divergência de informações.
---

# Skill: Sincronização Hierárquica (Hierarchy Sync)

Esta skill evita o surgimento de "documentações esquizofrênicas" no repositório (onde o README diz uma coisa, e o Relatório diz outra). Documentação fora de sintonia causa bugs na compreensão de futuros agentes.

## A Cascata da Verdade (Ordem Inegociável)
Toda atualização documental robusta deve fluir da base para o topo. Nunca atualize o topo (README) sem antes atualizar a base.
1. **Nível 1 (A Fonte de Dados):** `plano-de-acao/PLANO.md`, cartões em `TAREFAS.md` e logs (`LINHA-DO-TEMPO.md` e `MELHORIA-PLANO.md`). Tudo nasce aqui, com o código puro.
2. **Nível 2 (A Arquitetura):** `plano-de-acao/RELATORIO-GERAL-PROJETO.md`. Se o Nível 1 documentou uma nova biblioteca, skill ou regra de segurança, este relatório master deve absorver isso em linguagem de alto nível.
3. **Nível 3 (A Vitrine):** `README.md` (via skill `readme-open-source`). O README só é regenerado ou atualizado no final de todo o processo, consumindo as verdades dos Níveis 1 e 2.

Se você notar que a hierarquia estrutural mudou, acione o `gerador-de-m` para checar dependências em outras tarefas antes de aplicar qualquer sync em massa.
