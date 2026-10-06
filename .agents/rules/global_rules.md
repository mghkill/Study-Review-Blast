# Regras Mestras Globais do Projeto (Sempre Ativas)

Este arquivo contém as diretrizes inegociáveis para qualquer IA operando neste repositório. O sistema IDE (Antigravity) carrega qualquer arquivo desta pasta `.agents/rules/` nativamente e permanentemente como contexto de sistema em todas as sessões e prompts.

## 1. Passo a Passo Estrito (Nunca pular etapas)
- A IA **NUNCA** deve executar mais de uma tarefa por vez e **nunca deve pular etapas** previstas no plano.
- Sempre que executar uma tarefa do plano (seja de planejamento `M-xx` ou de código `T-xx`), a IA deve obrigatoriamente **PAUSAR** a execução ao final, fazer um resumo das ações, oferecer o commit (`git add .`) e **pedir autorização expressa do usuário** antes de iniciar a próxima tarefa.

## 2. Prevenção de Conflitos e Alucinações
- **Não alucine soluções:** Siga estritamente o que foi projetado nos documentos oficiais e respeite a arquitetura decidida.
- A IA não pode alterar, sobrescrever ou contrariar nenhuma Decisão oficial (D-xx) ou Melhoria (M-xx) já fechada sem autorização explícita do usuário.
- Se a IA identificar que uma instrução gerará conflito com regras vigentes, ela deve **parar** a execução direta e gerar um novo cartão `M` de correção de conflitos no `MELHORIA-PLANO.md`, expondo o impasse para decisão humana.

## 3. Segurança e Privacidade Estrita
- **Proteção de Segredos:** Nunca exponha o arquivo `.env` nem gere logs ou telas que vazem credenciais, chaves de API, tokens ou strings de conexão.
- **Zero Senhas no Git:** Nunca permita que senhas, tokens reais ou dados sensíveis sejam incluídos em commits ou arquivos rastreados (`.js`, `.json`, etc). O uso disso deve ser apagado e restrito ao `.env` não rastreado.
- **Soberania dos Dados:** Mantenha o projeto "100% local por padrão", não enviando dados dos usuários ou áudios para serviços terceiros inadvertidamente sem aviso explícito (Decisão D-18).

## 4. Segurança de Modificações (O Gerador de M)
- Para evitar bagunçar o projeto: nenhuma alteração estrutural, remoção de arquivos, limpeza ou refatoração arquitetural pode ser feita diretamente.
- Tudo o que sair do escopo de uma tarefa operacional `T-xx` já agendada deve passar primeiro pela geração de um cartão `M-xx` no `MELHORIA-PLANO.md` (via intenção do usuário no `PROMPTS_MESTRES.md`). O planejamento formal precede qualquer ação.

## 5. Reaproveitamento e Checagem Contínua
- Todo planejamento de `M-xx` DEVE iniciar identificando se há alguma skill em `.agents/skills/` que automatiza o problema (ex: `markdown-doctor` para links, `safe-cleanup` para lixo).
- **Regra do Prompt Mestre:** Se uma nova skill for gerada ou uma nova dinâmica permanente for criada, a IA é OBRIGADA a acionar a skill `prompt-updater` para registrar imediatamente essa nova capacidade no arquivo `PROMPTS_MESTRES.md`.

## 6. Transparência e Prevenção contra Limite de Tokens
- **Pré-Registro (Save State):** Antes de iniciar as alterações reais de qualquer `M-xx` ou `T-xx`, a IA DEVE registrar no LOG do plano correspondente (`MELHORIA-PLANO.md` ou `LINHA-DO-TEMPO.md`) o **plano exato** de execução (o que fará e onde mexerá). Assim, se a IA "cortar" por falta de tokens, o usuário saberá exatamente o que ela estava tentando fazer.
- **Pausa Cautelar de Complexidade:** Se a IA prever que uma tarefa é muito robusta (ex: renomeação em massa de arquivos, grandes refatorações), ela deve **avisar** o usuário sobre o risco e **PAUSAR ANTES** de iniciá-la. A IA só deve prosseguir quando o usuário autorizar o início do bloco mais complexo.

## 7. Oráculo de Contexto Obrigatório
- Quando o usuário fizer perguntas gerais como *"O que foi feito?"*, *"Onde estão os logs?"* ou pedir explicações sobre o estado do projeto, a IA **NÃO PODE** responder de memória. Ela é obrigada a usar a skill `project-oracle` para vasculhar `LINHA-DO-TEMPO.md`, `MELHORIA-PLANO.md` e o `RELATORIO-GERAL-PROJETO.md` para fornecer uma resposta exata baseada nos arquivos.

## 8. Sincronização Hierárquica de Documentação
- A atualização de documentação segue uma cascata rígida: **1º Arquivos de Planejamento/Logs** -> **2º Relatório Geral** -> **3º README**. Nunca atualize o topo (README) sem refletir a arquitetura na base (Relatório). Se a hierarquia estrutural mudar, confira e ajuste sempre as tarefas M correlacionadas para evitar bugs documentais.

## 9. Sincronização Cognitiva Profunda (Brain Sync)
- Ao receber comandos complexos ou ambíguos, a IA deve evocar a skill `brain-sync` internamente para cruzar dados de `.agents/rules/`, `.agents/skills/` e `PROMPTS_MESTRES.md`, garantindo que atue com 100% de inferência sobre o estado atual da governança do projeto, e não apenas de forma reativa.
