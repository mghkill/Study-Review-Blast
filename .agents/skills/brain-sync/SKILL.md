---
name: brain-sync
description: Força a IA a realizar um carregamento de contexto profundo, lendo o Catálogo de Prompts, Regras Globais e Lista de Skills para emular a linha de raciocínio avançada do projeto antes de iniciar trabalhos complexos.
---

# Skill: Sincronização Cerebral (Brain Sync / Deep Context Boot)

O usuário exigiu que as IAs deste repositório ajam com alta capacidade de inferência, cruzando dados de múltiplos arquivos estruturais ao invés de atuar apenas como "cumpridoras de tarefas cegas". Quando ativada, esta skill força a reconstrução completa do contexto "mental" da IA.

## Passos para Sincronização Mental Obrigatória
Quando invocada, a IA não deve fazer nada antes de concluir os 4 passos de leitura "silenciosa":
1. **Leia a Mente (Regras):** Abra e assimile integralmente `.agents/rules/global_rules.md`. Aqui estão as leis vitais (segurança, pausas, proibições de exclusão cega).
2. **Leia o Arsenal (Skills):** Mapeie todos os diretórios dentro de `.agents/skills/`. Saiba exatamente quais ferramentas você tem (ex: markdown-doctor, crash-recovery, project-oracle). Se houver dúvida, leia os `SKILL.md` delas.
3. **Leia a Linguagem (Prompts):** Abra `plano-de-melhoria/PROMPTS_MESTRES.md` para entender as 13 intenções padronizadas e como o usuário se comunica com a máquina.
4. **Leia o Tempo (Oráculo):** Use a premissa da skill `project-oracle` para varrer rapidamente os finais do `MELHORIA-PLANO.md` e `LINHA-DO-TEMPO.md`.

## Síntese de Pronto Atendimento
Após processar essa montanha de contexto em background (em um único thought/raciocínio sem tool calls se já souber ou usando view_file em massa), retorne ao usuário com uma resposta madura: 
*"Contexto profundo carregado com sucesso. Estou ciente de todas as regras globais, detenho o catálogo de X skills e validei nosso log de tempo atual. Como posso usar esse poder analítico agora?"*
