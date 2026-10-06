---
name: markdown-doctor
description: Varre arquivos markdown (.md) para encontrar e consertar links quebrados, referências obsoletas e garantir a coesão da documentação entre pastas após refatorações.
---

# Skill: Markdown Doctor

Esta skill automatiza a revisão de documentação, varrendo e curando links quebrados. É essencial para executar auditorias pós-renomeação.

## Regras de Operação (Ciclo de Observação)
1. **Verificação de Dependências (Look Ahead):** ANTES de corrigir qualquer link, o doctor deve ler a fila de tarefas no `MELHORIA-PLANO.md` e `TAREFAS.md`. Se houver uma tarefa destrutiva ou de faxina programada para ocorrer *logo após* ou *em concorrência*, o doctor deve intervir e exigir que a faxina seja feita **primeiro**. Nunca cure links de arquivos que estão prestes a ser deletados ou movidos.
2. **Varredura Ativa:** Após garantir que não há conflitos estruturais pendentes, o doctor deve usar ferramentas de busca para ler todos os `.md` do projeto buscando pelos nomes dos arquivos que foram movidos ou alterados.
3. **Atualização de Referências:** Substituir caminhos antigos pelos novos em todo o texto, garantindo a corretude dos links. Se o arquivo foi enviado para o legado, o link deve refletir a pasta `legado/`.
4. **Auditoria:** No final da cura, entregar um resumo exato de quais arquivos foram atualizados.
