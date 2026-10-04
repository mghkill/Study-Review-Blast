Li o relatório ( **RELATORIO-GERAL-PROJETO.md** ) inteiro e organizei a solução em duas partes:

Prompt A, para colar uma única vez. A IA só olha o projeto, cria o plano de melhoria e para.
Prompt B, curto, para colar a cada sessão. A IA executa uma única tarefa de melhoria (M-xx), registra o log e pausa.

Isso resolve o problema de a IA parar no meio: nenhuma sessão faz mais de uma M, e cada passo fica registrado no disco.

O que encontrei no relatório (as hipóteses que o Prompt A manda verificar)
Links absolutos de máquina. O §6 usa file:///c:/Users/opera/Desktop/Training%20Verbs/.... Isso quebra no GitHub e em qualquer outro computador. Precisam virar links relativos.
Voz contradiz o princípio "100% local". O §5B promete reconhecimento de fala com "análise fonética e pontuação". Mas a Web Speech API no Chrome envia o áudio para servidores do Google, e ela devolve texto e confiança, não análise de fonética. Isso conflita com o princípio nº 1 e com a D-18.
D-10 provavelmente incompleta. Pelo que vi do PLANO.md, a lista de dependências aprovadas parava na Fase 9. Faltam ts-fsrs (Fase 10), Playwright (Fase 12), as libs de OpenAPI/Swagger e cobertura (Fase 13). O plano acabaria violando a própria regra de "nada fora da D-10".
Pendências de decisão. D-11 (Docker) segue "Aguardando", e D-12 a D-18 seguem "Propostas". A D-14 (FSRS) trava a Fase 10.
Documentos demais dizendo a mesma coisa. São pelo menos oito: README, PLANO, RETOMAR, RELATORIO-GERAL, RELATORIO-RECONSTRUCAO-V2, PROMPT_INICIAL_LEGADOV2, PROMPT_ORIGINAL e SKILLENG. Falta uma hierarquia clara de qual manda.
SQL injection. Não vi nenhuma tarefa que audite as queries atuais (concatenação de strings) antes do ORM. O relatório só cita Zod e Drizzle.
Detalhes menores:
"Server 100% TS strict" na Fase 6 conflita com a D-07 ("incremental").
O migrations/README.md existe, e você pediu para remover READMEs sem função.
Continuo sem ver tarefa para as 4 falhas de teste do client (srs e tts) e a falha do server.
Como você usa (passo a passo)
Cole o Prompt A uma vez. A IA cria 2 arquivos, escreve o log e para.
Em cada sessão seguinte, cole o Prompt B. A IA faz uma M, registra e pergunta "continuar?".
Na M-06 a IA faz uma única pergunta com as suas decisões (Docker, FSRS, voz, dependências). Você responde uma vez.
Na M-15 ela entrega o prompt para iniciar o T-001, e só então o projeto começa.


## Prompt A (colar uma vez)

```bash
# Prompt A

Antes de qualquer ação no projeto StudyReviewBlast, leia integralmente, nesta ordem:
1. plano-de-acao/RELATORIO-GERAL-PROJETO.md
2. plano-de-acao/RETOMAR.md
3. plano-de-acao/PLANO.md

Compreenda e respeite as regras, decisões e restrições desses arquivos. Em caso de conflito, inconsistência ou ambiguidade entre eles, NÃO suponha: registre como pergunta Q-xx no plano de melhoria e siga apenas com o que não depende da resposta.

## Missão desta sessão
Esta sessão é SOMENTE para (a) olhar o projeto de forma leve e (b) criar o plano de melhoria do planejamento. Depois PARE. Você tem acesso total ao PC: crie os arquivos você mesma. Só me peça algo se precisar instalar algo.

## Escopo permitido (sempre, em todas as sessões deste trabalho)
- Pode CRIAR e EDITAR apenas arquivos .md dentro de plano-de-acao/, de skills/ e o README.md da raiz.
- Pode LER qualquer arquivo do projeto, inclusive código, para avaliar.
- É PROIBIDO: alterar código-fonte, testes, migrations, package.json, plan_tool.py, dependências, banco, portas, proxy; instalar algo; commitar; fazer push; executar qualquer tarefa T do plano de ação; rodar plan_tool.py com start/done/log (só `py plano-de-acao/plan_tool.py status`).
- Aditivo: NADA do que já está feito pode ser removido. Correções são feitas no próprio lugar, com nota no log. Novas tarefas entram sem renumerar as existentes (use `py plano-de-acao/plan_tool.py add-feature` apenas se eu autorizar; caso contrário registre a nova T como proposta no plano de melhoria). Novas decisões usam D-19, D-20...
- Edite com alterações pequenas e localizadas (str_replace), não reescreva arquivos inteiros. Sempre UTF-8 (no PowerShell use -Encoding UTF8 e confira que acentos não corromperam).

## Passo 1 (leve, leitura): reconhecimento
- Liste plano-de-acao/ (recursivo), skills/ (recursivo) e a raiz. Leia só o necessário: cabeçalhos e primeiras linhas dos demais .md, `py plano-de-acao/plan_tool.py status` e `git status` real (anote a branch atual).
- NÃO leia o código inteiro agora. A leitura profunda é dividida nas tarefas M abaixo.

## Passo 2: criar os arquivos do plano de melhoria
Crie exatamente 2 arquivos:

A) skills/SKILL-MELHORIA-PLANO.md (a "skill" que vou mandar você ler nas próximas sessões), contendo:
- Objetivo: melhorar o planejamento (plano-de-acao/, skills/, README.md) sem executar o plano de ação.
- O escopo permitido e proibido acima.
- Ciclo de CADA sessão: (1) ler SKILL-MELHORIA-PLANO.md e plano-de-acao/MELHORIA-PLANO.md; (2) se existir M marcada [~], NÃO começar outra: rode `git status` e `git diff --stat`, verifique o estado do arquivo que ela mexia e termine ou reverta SÓ essa M; (3) pegar a próxima M [ ]; (4) escrever no log "INÍCIO M-xx" e marcar [~] ANTES de trabalhar; (5) fazer só aquela M, uma edição pequena por vez; (6) marcar [x] com nota curta e escrever no log "FIM M-xx" com arquivos alterados e achados; (7) mostrar resumo, rodar `git status`, oferecer `git add .` NA RAIZ do repositório (nunca só uma pasta) com mensagem de commit em inglês (Conventional Commits, ex.: `docs(plan): <resumo> (M-xx)`), sem executar; (8) PARAR e perguntar "Continuar com M-yy?".
- Regra de ouro: UMA M por sessão. Se terminar cedo, pare mesmo assim. Se sentir que o contexto está acabando, escreva o log ANTES de continuar editando.
- Conflitos e dúvidas viram Q-xx no plano de melhoria; não decidir sozinha o que é decisão minha.
- Fonte da verdade: após a M-07, vale a hierarquia definida ali.

B) plano-de-acao/MELHORIA-PLANO.md, no estilo do PLANO.md, com: legenda ([ ] pendente · [~] em andamento · [x] feita · [!] bloqueada); bloco "PRÓXIMO PASSO"; seção "Achados" (F-xx), "Lacunas do legado" (L-xx), "Perguntas para o usuário" (Q-xx); a lista de tarefas M abaixo; e uma seção "LOG" no final (append-only, com data e hora). Cada M deve ter 1 linha de objetivo, os arquivos que lê e o arquivo que altera. Tarefas M iniciais:

Fase M1 — Varredura (somente leitura; o resultado vai para este plano)
- M-01 Inventário: listar todos os .md/.py de plano-de-acao/, skills/, raiz e legado/ com tamanho e função; classificar ATIVO / LEGADO / HISTÓRICO; apontar duplicações e arquivos órfãos (inclua migrations/README.md: tem função? sugerir manter ou remover, sem remover).
- M-02 Verdade no disco: conferir `plan_tool.py status`; contar cartões em TAREFAS.md (esperado 94, T-001 a T-094, sem faltar nem repetir); campos obrigatórios por cartão (objetivo, back, front, teste antes, pronto, tamanho P/M, prompt, pausa); conferir cada afirmação do RELATORIO-GERAL (§2 árvore vs disco, §3 estado, migrations 001–009 existem); verificar se `plan_tool.py init` depende de skills/assets/PLANO.inicial.md (só relatar).
- M-03 Conformidade com PROMPT_INICIAL_LEGADOV2.md e PROMPT_ORIGINAL.md: checklist R-01..R-16 abaixo, cada um ✅/⚠️/❌ com evidência (arquivo e linha).
- M-04 Auditoria do legado: para CADA tarefa de legado/PLANO-v1.md (T-001 a T-090, inclusive opcionais), confirmar que o destino em legado/MAPA-V1-V2.md existe em TAREFAS.md com conteúdo real (não só título) e, para as marcadas concluídas, que há evidência no disco. Tudo sem destino ou sem evidência vira L-xx.
- M-05 Auditoria de código (SOMENTE LEITURA) dos pontos que o plano deve cobrir: SQL montado por concatenação/interpolação de strings; rotas sem validação de entrada; erros que vazam SQL; testes quebrados (client srs/tts, server status red→yellow) e se alguma T cuida deles; extensão pgcrypto sem uso; textos/comentários em português e acentos corrompidos; console.log. Resultado: achados F-xx com arquivo:linha. Não alterar código.

Fase M2 — Decisões e consistência
- M-06 Consolidar TODAS as minhas pendências em UMA única pergunta, cada uma com a sua recomendação para eu só responder "ok" ou trocar: D-11 (Docker), D-12 a D-18, lista D-10 incompleta (ts-fsrs, Playwright, libs de OpenAPI e cobertura), voz vs princípio "100% local" (reconhecimento de fala no Chrome envia áudio ao Google), e quaisquer Q-xx. Depois PARE e espere minha resposta.
- M-07 Hierarquia de documentos: definir qual arquivo manda em quê e a ORDEM ÚNICA de leitura (sugestão a verificar: RELATORIO-GERAL → RETOMAR → PLANO → cartão em TAREFAS); marcar legado/ como somente leitura; listar links absolutos `file:///c:/...` a trocar por relativos.

Fase M3 — Aplicação nos .md (um arquivo por M; só depois da M-06 respondida)
- M-08 PLANO.md: situação das decisões; D-10 estendida (só o que eu aprovar); novas T como propostas conforme F-xx e L-xx (inclua, se não existir, uma T para auditar/eliminar SQL por concatenação antes do ORM e uma para as falhas de teste conhecidas).
- M-09 TAREFAS.md: cartões das T novas e correções pontuais nos cartões afetados.
- M-10 RETOMAR.md alinhado à hierarquia da M-07.
- M-11 RELATORIO-GERAL-PROJETO.md: links relativos, §5B (voz) conforme minha decisão, "100% TS strict" vs D-07 (incremental).
- M-12 skills/SKILLENG.md, convencoes-v2.md e skill.md alinhados.
- M-13 README.md da raiz alinhado (onde parei, decisões em linguagem simples, melhorias pós-prova de fogo, tradução para inglês na Fase 15).
- M-14 legado/MAPA-V1-V2.md e legado/RELATORIO-RECONSTRUCAO-V2.md: correções do mapa (linha V1 T-001; faixas da tabela "100% novas" por listas exatas) e das lacunas L-xx.
- M-15 Verificação final: repetir M-02, checar links, `plan_tool.py status`, `git status`; registrar que o planejamento está pronto; entregar o prompt exato para iniciar o T-001; propor arquivar MELHORIA-PLANO.md em legado/.

Você pode ACRESCENTAR tarefas M (M-16...) se o Passo 1 mostrar algo novo, mas não pode remover nem renumerar as acima.

Checklist de requisitos para a M-03:
R-01 reaproveita o plano V1 e preserva o histórico em legado/; R-02 tarefas pequenas (P ou M), uma por sessão; R-03 todo T inclui o front (ou justificativa); R-04 teste escrito antes e visto falhando; R-05 pausa em todo T com `git add .` na raiz, sem push, commit em inglês convencional; R-06 nada pago no plano (ideias pagas só em "Melhorias pós-prova de fogo" no README); R-07 ORM + qualidade (lint, hooks, CI, Zod, segurança, logs) e proteção contra SQL injection; R-08 tradução total para inglês planejada e não executada, com i18n; R-09 estudo estilo Anki + repetição espaçada + dashboard + voz gratuita; R-10 README da raiz como guia mestre (onde parei, algoritmo do dia, prompt por T, decisões em linguagem simples, melhorias pós-T-090); R-11 RETOMAR.md é o ponto de entrada diário e funciona ao trocar de modelo de IA; R-12 READMEs sem função de client/ e server/ removidos; R-13 prova de fogo final; R-14 dependências só da lista aprovada, e essa lista cobre TODAS as fases; R-15 portas, proxy e scripts dev intactos, salvo D-07 e D-09; R-16 nenhum segredo nos documentos.

## Passo 3: terminar esta sessão
Escreva no LOG: "INÍCIO/FIM M-00 (criação do plano de melhoria)". Entregue um resumo curto: o que viu no Passo 1 (inventário em 10 linhas, resultado do `status`, branch atual), os 2 arquivos criados, e `git status` real. Ofereça `git add .` na raiz sem executar. Depois PARE e escreva apenas: "Cole o Prompt B para começar a M-01."
Não execute nenhuma M nesta sessão.
```


## Prompt B (colar em cada sessão seguinte)

```bash 
# Prompt B
Leia skills/SKILL-MELHORIA-PLANO.md e plano-de-melhoria/MELHORIA-PLANO.md e siga o ciclo da skill. Execute APENAS a próxima tarefa M pendente (ou termine a que estiver em [~]). Não altere código, não commite, não faça push. Ao final: log, resumo, `git status`, oferta de `git add .` na raiz, e PARE perguntando se devo continuar.
```