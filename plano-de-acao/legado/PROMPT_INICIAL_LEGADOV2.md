Você está ASSUMINDO uma tarefa de PLANEJAMENTO deste projeto (StudyReviewBlast) que outra IA (Opus 5.5) interrompeu por falta de tokens. Você tem acesso total ao PC: crie, edite e mova arquivos de documentação e rode comandos de leitura você mesma. Eu só dou o comando; só me peça algo se precisar instalar algo ou se a decisão for realmente minha.

## Regra principal
Esta tarefa é APENAS DE PLANEJAMENTO. NÃO altere código-fonte, testes, migrations, package.json, dependências, banco, portas, proxy nem scripts. Não instale nada. Não faça commit nem push. Não retome nem execute nenhuma tarefa do plano. Não rode comandos do plan_tool.py que alterem estado (só `py plano-de-acao/plan_tool.py status`).

## Contexto do que a IA anterior fez (CONFIRME NO DISCO antes de confiar)
Objetivo original: reconstruir o plano do projeto em um "V2" melhor, reaproveitando o plano antigo (V1), com tarefas pequenas (uma por sessão), teste escrito antes, front incluso em cada tarefa, nada pago, ORM, TypeScript, segurança, tradução para inglês/i18n, quiz estilo Anki com FSRS, voz gratuita, CI, documentação, prova de fogo (T-090 antigo) e README como guia mestre.

Já feito (segundo o log):
- Leu RETOMAR.md, PLANO.md, LINHA-DO-TEMPO.md, plan_tool.py, PROMPT_ORIGINAL.md, .agents/skills/coder/old-root-skills/skill.md e skills/SKILLENG.md, e o código para entender.
- Moveu para plano-de-acao/legado/: PLANO-v1.md, RETOMAR-v1.md e (de skills/assets/) PLANO.inicial-v1.md.
- Criou o novo plano-de-acao/PLANO.md (V2): 15 fases, 94 tarefas, decisões D-01 a D-18, dependências aprovadas (D-10), regras fixas. `py plano-de-acao/plan_tool.py status` já lê o V2 (3/94 marcadas, próxima T-001) sem mudar o script.
- Estava escrevendo plano-de-acao/TAREFAS.md (cartões detalhados de cada tarefa) quando acabaram os tokens. NÃO SEI se terminou.

## Passo 0: verificar antes de agir
1. Liste plano-de-acao/ (recursivo), skills/ e rode `git status`.
2. Leia o PLANO.md V2 inteiro e o TAREFAS.md que existir. Para CADA uma das 94 tarefas do PLANO.md, confira se existe cartão no TAREFAS.md e se está completo.
3. Leia legado/PLANO-v1.md, legado/RETOMAR-v1.md, PROMPT_ORIGINAL.md, LINHA-DO-TEMPO.md, .agents/skills/coder/old-root-skills/skill.md, skills/SKILLENG.md e o README.md da raiz.
4. Faça uma lista curta do que está pronto, incompleto e faltando. NÃO refaça o que já está bom. Mantenha as decisões D-xx, a numeração, as fases e o formato do PLANO.md.

## Passo 1: completar o que falta (nesta ordem)
1. TAREFAS.md: complete os cartões que faltam ou estão cortados. Cada cartão deve ter: objetivo, parte de back, parte de FRONT (ou "sem impacto no front" justificado), TESTE ESCRITO ANTES (e que deve ser visto falhando), critério de pronto, tamanho (P ou M; divida qualquer tarefa grande, atualizando o PLANO.md se precisar), e o prompt/comando exato que eu dou à IA para executar aquela tarefa. Todo cartão termina com a PAUSA obrigatória (ver 3.1).
2. plano-de-acao/legado/MAPA-V1-V2.md: crie se não existir (tarefa antiga → tarefa nova; marque o que já estava feito, o que foi reaproveitado e o que foi substituído). O PLANO.md já referencia esse arquivo.
3. plano-de-acao/RETOMAR.md (NOVO, hoje não existe porque o antigo foi movido): é o arquivo que eu mando a IA ler todo dia. Deve conter as regras fixas, o fluxo do dia, o protocolo de pausa, como retomar após limite de tokens ou troca de modelo, e a ordem de leitura (RETOMAR.md → PLANO.md → TAREFAS.md → fim da LINHA-DO-TEMPO.md → `plan_tool.py status`). Reaproveite o que valia no RETOMAR-v1.md.
4. README.md da raiz: reescreva como vitrine do projeto e guia mestre para mim: resumo e stack, como rodar, "onde parei / como prosseguir" com o prompt exato, o algoritmo de um dia de trabalho, tabela das fases e tarefas com o prompt de cada T, como retomar após interrupção, seção "Decisões explicadas" em linguagem simples (D-01 a D-18), e "Melhorias pós-prova de fogo" (pagas e extras: IA para frases, TTS premium, login, hospedagem, Sentry etc., com custo aproximado e quando adotar). Resumo em inglês no topo e o resto em pt-BR (D-08). Não duplique o PLANO.md; linke.
5. Remova client/README.md e server/README.md (desnecessários) e garanta que nada aponte para eles (cuidado: server/tests/migrator.test.js só usa 'README.md' como exemplo de nome de arquivo ignorado; isso NÃO é referência, não mexa no teste).
6. LINHA-DO-TEMPO.md: acrescente uma entrada com data e hora dizendo que o V2 foi construído (o que mudou e por quê), registrando também que houve troca de IA no meio.
7. skills/: verifique se skill.md e SKILLENG.md ainda referenciam skills/assets/PLANO.inicial.md (movido) ou o protocolo antigo. Se sim, atualize APENAS esses trechos para o V2 (pausa + `git add .` na raiz + teste antes). Se o plan_tool.py precisar de mudança para funcionar com o V2, NÃO mude; registre como exceção proposta.
8. PROMPT_ORIGINAL.md: só acrescente uma nota curta se necessário.

## 3. Regras que o V2 deve respeitar (valide e corrija o que violar)
3.1 PAUSA obrigatória no fim de TODA tarefa: (1) rodar testes e lint; (2) resumir o que mudou; (3) rodar `git status` e oferecer `git add .` NA RAIZ do repositório (nunca só uma pasta); (4) sugerir a mensagem de commit em inglês, Conventional Commits; (5) NÃO fazer push (eu faço); (6) atualizar PLANO.md e LINHA-DO-TEMPO.md e PARAR.
3.2 Nada pago no V2 (vai para "Melhorias pós-prova de fogo" no README). Dependência nova só da lista D-10; fora dela, vira nova decisão.
3.3 Tradução para inglês e i18n: planejada (Fase 9), NÃO executada agora.
3.4 `npm run dev` (server 3001, client 5173) e proxy do Vite não mudam, exceto as exceções já registradas no PLANO.md (D-07, D-09).
3.5 Docker não está instalado nesta máquina (D-11): isso é uma decisão minha, não instale.

## 4. Ao terminar
Pare e me entregue um relatório curto:
- Arquivos criados, alterados, movidos e removidos (com caminhos).
- Resultado do `py plano-de-acao/plan_tool.py status` (deve continuar funcionando).
- Qualquer inconsistência que você encontrou e corrigiu no trabalho da IA anterior.
- UMA mensagem única com as decisões que preciso confirmar (hoje em "Aguardando": D-02, D-03, D-05, D-06, D-07, D-08, D-09, D-10, D-11), cada uma com a sua recomendação, para eu só responder "ok" ou trocar.
- O prompt exato para eu executar o T-001.
- `git status` e a oferta do `git add .` na raiz (sem commitar).