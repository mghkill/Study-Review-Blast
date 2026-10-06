---
name: crash-recovery
description: Recupera o contexto de tarefas interrompidas abruptamente por limites de token ou quedas de sistema, informando ao usuário exatamente onde a IA parou.
---

# Skill: Crash Recovery (Recuperação de Pane)

Se o usuário invocar esta skill informando que o sistema "caiu", "parou no meio" ou "cortou por tokens", você deve agir como um investigador para restaurar a linha de raciocínio original sem pular etapas ou perder dados.

## Como Investigar e Recuperar
1. **Verifique a Linha do Tempo:** Leia as últimas linhas de `plano-de-acao/LINHA-DO-TEMPO.md`. Identifique qual foi a última `[T-XX] iniciada` que NÃO possui uma entrada de `[T-XX] concluída` abaixo dela.
2. **Verifique o Plano de Melhorias:** Leia os últimos logs no final de `plano-de-melhoria/MELHORIA-PLANO.md` para ver se um `M-XX` foi iniciado mas cortado antes do seu log de "FIM".
3. **Verifique Arquivos Órfãos:** Veja quais arquivos ficaram com modificações pendentes no Git (`git status`) para deduzir o que a IA estava programando.
4. **Relatório de Resgate:** Entregue ao usuário um resumo cirúrgico: "O sistema caiu enquanto executávamos a tarefa X. O último arquivo tocado foi Y. Para continuarmos exatamente de onde paramos, nossa próxima ação deve ser Z."
