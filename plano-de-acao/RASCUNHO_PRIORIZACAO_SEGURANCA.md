# Rascunho de Repriorização (Security First) - Resultado da M-41

## 1. Análise do Estado Atual
Atualmente, as tarefas de segurança estão no final do arquivo `PLANO.md` e `TAREFAS.md`, o que significa que elas só seriam executadas após meses de desenvolvimento, deixando a aplicação vulnerável. A fila atual de execução está na Fase 2 (T-005).

**Tarefas de Segurança identificadas na "lanterna" da fila:**
- `T-095` (Parametrizar LIMIT e sanitizar erros API)
- `T-098` (Sanitizar LIMIT interpolado - SEC-01)
- `T-099` (Remover err.message - SEC-02)
- `T-100` (Adicionar helmet - SEC-04)
- `T-101` (Remover console.log de credenciais - SEC-03)
- `T-102` (Instalar express-rate-limit - SEC-05)

## 2. A Nova Ordem Proposta (Para a M-42 e M-43)

Para garantir a regra de "Security First", propomos a criação de um bloco de prioridade máxima chamado **"Fase 1.5 — Hotfixes de Segurança (Security First)"**. Este bloco será inserido *imediatamente antes* da Fase 2 atual no `PLANO.md` e no `TAREFAS.md`.

### O que mudará no arquivo PLANO.md (M-42):
A seguinte seção será injetada logo após o fim da "Fase 1":

```markdown
## Fase 1.5 — Hotfixes de Segurança (Security First)
- [ ] T-095 [P] Parametrizar LIMIT e OFFSET e criar sanitizador de erros na API sem vazar err.message nem SQL
- [ ] T-098 [P] Sanitizar LIMIT interpolado em reviews.js (SEC-01)
- [ ] T-099 [P] Remover vazamento de err.message genérico em 35 rotas (SEC-02)
- [ ] T-100 [P] Instalar e configurar helmet para headers de segurança HTTP (SEC-04)
- [ ] T-101 [P] Remover console.log que vaza dados de infraestrutura no startup (SEC-03)
- [ ] T-102 [P] Instalar e configurar express-rate-limit nas rotas críticas (SEC-05)
```
*A seção antiga "Funcionalidade adicionada Nº 1" no final do plano será removida.*

### O que mudará no arquivo TAREFAS.md (M-43):
Os blocos completos de texto dos cartões `T-095` e `T-098` a `T-102` serão movidos fisicamente para cima, sendo reposicionados imediatamente antes do cabeçalho da `Fase 2` e do cartão `T-005`.

---
> **Próximo passo:** Se este rascunho for aprovado, a `M-42` irá alterar o `PLANO.md` e a `M-43` irá alterar o `TAREFAS.md` para implementar essa exata reordenação.
