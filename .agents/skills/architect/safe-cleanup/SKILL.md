---
name: safe-cleanup
description: Limpa arquivos antigos ou obsoletos de forma segura. Obriga a IA a explicar o propósito do arquivo, provar que ele está obsoleto e pedir autorização antes de enviá-lo para a lixeira ou para o legado.
---

# Skill: Limpador Seguro (Safe Cleanup)

Esta skill garante que nenhuma informação importante seja perdida em processos de faxina do repositório.

## Regras de Limpeza
1. **Identificação:** Leia o conteúdo do arquivo que o usuário deseja deletar.
2. **Justificativa:** Explique resumidamente o que o arquivo faz e por que ele é considerado obsoleto agora.
3. **Destino:** Pergunte ao usuário se o arquivo deve ser **excluído permanentemente** ou movido para `plano-de-acao/legado/` (backup de segurança).
4. **Autorização:** Só execute a deleção ou movimentação **após** a autorização explícita do usuário. Nenhuma faxina deve ser feita silenciosamente.
