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

## 5. Reaproveitamento e Checagem
- Antes de formular novas soluções manuais, a IA deve vasculhar a pasta `.agents/skills/`. Se existir uma skill nativa que faça o trabalho, ela DEVE ser usada para garantir previsibilidade e não reinventar a roda.
