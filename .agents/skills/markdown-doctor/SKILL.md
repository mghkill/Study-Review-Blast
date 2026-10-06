---
name: markdown-doctor
description: Varre arquivos markdown (.md) para encontrar e consertar links quebrados, referências obsoletas e garantir a coesão da documentação entre pastas após refatorações.
---

# Skill: Markdown Doctor

Esta skill automatiza a revisão de documentação, varrendo e curando links quebrados. É essencial para executar auditorias pós-renomeação.

## Regras de Operação
1. **Varredura:** Se um diretório for alterado/renomeado, o doctor deve ler todos os `.md` do projeto que referenciam aquele diretório.
2. **Atualização de Referências:** Substituir caminhos antigos pelos novos, garantindo a corretude dos links.
3. **Auditoria:** No final da faxina, o doctor deve entregar um resumo dos links que foram corrigidos.
