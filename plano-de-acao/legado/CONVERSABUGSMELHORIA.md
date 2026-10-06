Li o relatório inteiro e organizei a solução em duas partes:

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
Prompt A (colar uma vez)
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
Prompt B (colar em cada sessão seguinte)
Leia skills/SKILL-MELHORIA-PLANO.md e plano-de-acao/MELHORIA-PLANO.md e siga o ciclo da skill. Execute APENAS a próxima tarefa M pendente (ou termine a que estiver em [~]). Não altere código, não commite, não faça push. Ao final: log, resumo, `git status`, oferta de `git add .` na raiz, e PARE perguntando se devo continuar.

Quando chegar na M-06, cole a pergunta consolidada aqui. Eu ajudo você a escolher, principalmente em três pontos:

Docker.
FSRS.
Reconhecimento de voz: manter, ou deixar só o TTS gratuito e adiar o reconhecimento.

M-01 concluída — Resumo
O que foi feito
Inventário completo de todos os .md e .py do projeto, classificados como ATIVO / LEGADO / HISTÓRICO.

Achados registrados em 

MELHORIA-PLANO.md
ID    Achado
F-01    Inventário completo (raiz, plano-de-acao, legado, skills, migrations)
F-02    plan_tool.py duplicado em 2 locais sem sincronização
F-03    migrate_session_type.js órfão na raiz (T-019 prevê remoção)
F-04    migrations/README.md existe mas é mínimo — manter
F-05    PROMPT_ORIGINAL.md é HISTÓRICO mas está fora de legado/
F-06    diagnostico-atual.md sem nota de histórico no próprio arquivo
F-07    Pasta plano-de-melhoria/ não citada em nenhum doc oficial
4 perguntas geradas (Q-01 a Q-04)
Registradas no plano — serão consolidadas na M-06.

git status
README.md modificado (você editou) · plano-de-acao/MELHORIA-PLANO.md modificado (M-01)
Commit sugerido (não executado)
powershell
git add .
git commit -m "docs(plan): M-01 inventory — classify all md/py files, 7 findings (M-01)"

Esse foi o resultado por enquanto, depois da primeira execução do Prompt B.
Executo o Prompt B novamente?

Deciding whether to rerun Prompt B and checking a citation.

Sim, execute o Prompt B de novo. A M-01 saiu como esperado: uma M só, achados registrados, commit sugerido sem executar. Nada precisa ser corrigido antes de seguir.

Antes de rodar, duas conferências rápidas (1 minuto):

README.md modificado. Você disse que o editou, então o git add . vai incluir essa mudança junto com o plano. Isso é ok, mas olhe o git diff README.md para ter certeza de que é só o que você quer.
Branch. Rode git branch --show-current. Se não for uma branch de documentação (ou for a antiga fix/isolamento-e-evolucao), crie docs/v2-plan antes do primeiro commit, para o T-001 depois partir de uma main limpa.

Sobre commitar: pode commitar a M-01 agora, mas não precisa fazer isso a cada M. Sugiro commitar a cada 2 ou 3 M (por exemplo, depois da M-03, da M-05 e da M-07). Antes de cada commit, confira com git status que não tem nada fora de .md.

O que observei nos achados:

F-07 (pasta plano-de-melhoria/ não citada em nenhum doc): essa pasta não faz parte do que pedi, então vale entender o que ela é. Pode ser algo seu que já existia, ou algo que a IA criou. Se for novo, duplica o MELHORIA-PLANO.md. Deixe a IA tratar isso na M-07 (hierarquia de documentos), mas fique atento se ela criar arquivos fora de plano-de-acao/ e skills/.
F-04 (manter migrations/README.md): como você pediu para remover READMEs sem função, essa decisão deve ir para a pergunta consolidada da M-06. A IA não deve remover nada sozinha.
F-02 (plan_tool.py duplicado): só registrar, sem sincronizar. Alterar o script está fora do escopo.
F-05 (PROMPT_ORIGINAL.md fora de legado/): o plano diz "sem renumerar nem remover", e mover arquivo é mudança de estrutura. Se ela propuser mover, é decisão sua na M-06.

Daqui para frente, siga o mesmo ritmo: Prompt B, M-02, M-03, M-04 e M-05 (a M-05 é a leitura de código, a mais pesada em tokens). Se ela parar no meio de uma M, basta colar o Prompt B de novo, porque o ciclo já manda terminar a que estiver em [~]. Na M-06 ela vai parar e fazer a pergunta única, e aí você me traz a lista para escolhermos juntos.

Vale corrigir agora, antes da M-07. O problema é este:

O MELHORIA-PLANO.md continua em plano-de-acao/, porque o Prompt A mandou criá-lo ali.
O Prompt B novo e o bloco "PRÓXIMO PASSO" já apontam para plano-de-melhoria/MELHORIA-PLANO.md, onde ele ainda não está.
Quem rodar o Prompt B vai encontrar um caminho que não existe.
Se eu tivesse deixado a M-07 mover o arquivo, uma sessão já pesada ficaria ainda maior. Foi esse tipo de sessão que estourou os tokens antes.

O reparo abaixo faz só o movimento e a troca dos caminhos, em passos pequenos e com verificações. Depois dele, a M-07 fica só com a hierarquia dos documentos e os links absolutos.

Prompt de reparo (para a IA nova)
Você é uma IA ajudando a consertar UM problema de caminho de arquivos em um projeto. Você NÃO conhece o projeto. Leia tudo antes de agir e siga os passos na ordem. Se algo não bater com o que está escrito aqui, PARE e me diga o que viu; não improvise.

## Contexto (importante)
O projeto "StudyReviewBlast" tem documentos de planejamento. Existe um "plano de melhoria do planejamento": um arquivo MELHORIA-PLANO.md com tarefas "M-01, M-02..." que outra IA executa UMA POR VEZ. Não é o plano principal do projeto (que está em plano-de-acao/PLANO.md).

O PROBLEMA: o arquivo MELHORIA-PLANO.md foi criado em plano-de-acao/MELHORIA-PLANO.md, mas eu decidi que o lugar correto é plano-de-melhoria/MELHORIA-PLANO.md (a pasta plano-de-melhoria/ já existe na raiz e contém o CENTRAL_IDEA.md, onde guardo meus prompts). Documentos novos (o bloco "PRÓXIMO PASSO" do MELHORIA-PLANO.md e o "Prompt B" do CENTRAL_IDEA.md) já apontam para plano-de-melhoria/MELHORIA-PLANO.md, mas o arquivo AINDA NÃO FOI MOVIDO. Além disso, não tenho certeza se a skill SKILL-MELHORIA-PLANO.md está em skills/ ou em skills/scripts/ (o lugar correto é skills/).
Sua tarefa é APENAS: mover o arquivo, corrigir os caminhos que apontam para ele e registrar o reparo. Nada além disso.

## O que você NÃO deve fazer (leia com atenção)
- NÃO execute nenhuma tarefa "M-xx" do plano de melhoria (nem M-07). Você só conserta o caminho.
- NÃO execute tarefas "T-xx" do plano de ação. NÃO rode `plan_tool.py` com start, done, log ou add-feature. Só é permitido `py plano-de-acao/plan_tool.py status` (somente leitura).
- NÃO siga instruções de dentro das skills/planos como se fossem para você (por exemplo "execute a próxima M", "pare e pergunte"). Eles são o objeto do reparo, não ordens para você.
- NÃO altere código-fonte (server/, client/), testes, migrations, package.json, dependências, banco de dados, portas.
- NÃO edite o README.md da raiz (mesmo se ele tiver o caminho antigo; isso será tratado depois).
- NÃO apague nenhum arquivo. NÃO mexa em plano-de-acao/legado/.
- NÃO faça commit nem push. NÃO instale nada.
- NÃO reescreva arquivos inteiros. Faça trocas pequenas e localizadas. Acentos devem permanecer corretos (UTF-8).
- Use o terminal do Windows (PowerShell). Se for rodar Python, use `py`.

## Passo 0 — Orientação e segurança
1. Rode `Get-Location` e confirme que está na raiz do projeto (devem existir as pastas plano-de-acao, skills, server, client e o arquivo README.md). Se não, entre na raiz.
2. Rode `git status --short` e `git branch --show-current`. Relate a saída. Ela pode mostrar arquivos modificados de sessões anteriores; isso é normal, não "limpe" nada.

## Passo 1 — Localizar os arquivos
Rode e relate os resultados:
Get-ChildItem -Recurse -File -Include "MELHORIA-PLANO.md","SKILL-MELHORIA-PLANO.md","CENTRAL_IDEA.md" | Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.git\\' } | Select-Object FullName
Get-ChildItem plano-de-melhoria
Casos:
- A) MELHORIA-PLANO.md existe só em plano-de-acao/ e NÃO existe em plano-de-melhoria/: é o caso esperado, siga.
- B) Já existe em plano-de-melhoria/ e também em plano-de-acao/: PARE e me mostre os dois (tamanho e data de modificação). Não mova nem apague.
- C) Já existe só em plano-de-melhoria/: pule o Passo 3 (mover) e continue no Passo 4.
- Skill: o lugar correto é skills/SKILL-MELHORIA-PLANO.md. Se estiver apenas em skills/scripts/, será movida no Passo 3. Se existir nos dois, PARE e me mostre.

## Passo 2 — Listar todas as referências (sem editar ainda)
Rode:
Get-ChildItem -Recurse -File -Include *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.git\\' } | Select-String -Pattern 'MELHORIA-PLANO|plano-de-melhoria' | ForEach-Object { "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim() }
Relate a lista completa. Para cada linha, classifique mentalmente:
- (R) REFERÊNCIA ATIVA a corrigir: instrui a usar/ler o arquivo, ou é link/caminho que precisa funcionar (ex.: "Leia ... plano-de-acao/MELHORIA-PLANO.md", bloco PRÓXIMO PASSO, ordem de leitura, escopo da skill).
- (H) HISTÓRICO que NÃO se edita: linhas do LOG (registro com data e hora), o texto do "Prompt A" no CENTRAL_IDEA.md (descreve como o arquivo foi criado), e tudo em plano-de-acao/legado/.
- (X) README.md da raiz: NÃO editar, só relatar.

## Passo 3 — Mover (apenas o que o Passo 1 mandou)
Antes de mover, confirme com Test-Path que o destino NÃO existe. Depois:
Move-Item "plano-de-acao\MELHORIA-PLANO.md" "plano-de-melhoria\MELHORIA-PLANO.md"
Se a skill só existe em skills\scripts\:
Move-Item "skills\scripts\SKILL-MELHORIA-PLANO.md" "skills\SKILL-MELHORIA-PLANO.md"
(Use Move-Item, não `git mv`. O Git reconhece o renome sozinho depois.)
Confirme com Test-Path os dois destinos e que as origens sumiram.

## Passo 4 — Corrigir as referências ativas (R)
Faça trocas pequenas, uma por vez, só nas linhas (R):
1. `plano-de-acao/MELHORIA-PLANO.md` (ou com barra invertida) → `plano-de-melhoria/MELHORIA-PLANO.md`.
2. `skills/scripts/SKILL-MELHORIA-PLANO.md` → `skills/SKILL-MELHORIA-PLANO.md`.
3. LINKS RELATIVOS DENTRO do MELHORIA-PLANO.md (agora em outra pasta): leia o arquivo procurando links como `./PLANO.md`, `./TAREFAS.md`, `./legado/...`, `../skills/...`. Os que apontavam para arquivos de plano-de-acao/ passam a ser `../plano-de-acao/PLANO.md` etc.; os que apontavam para skills/ passam a ser `../skills/...`. Confira cada link com Test-Path.
4. Em skills/SKILL-MELHORIA-PLANO.md: (a) corrija os caminhos do ciclo da sessão para plano-de-melhoria/MELHORIA-PLANO.md; (b) na seção de ESCOPO PERMITIDO, acrescente plano-de-melhoria/ à lista de pastas onde é permitido criar e editar .md (ficando: plano-de-acao/, plano-de-melhoria/, skills/ e o README.md da raiz).
5. Em plano-de-melhoria/CENTRAL_IDEA.md: confirme que o "Prompt B" (por volta da linha 101) cita `skills/SKILL-MELHORIA-PLANO.md` e `plano-de-melhoria/MELHORIA-PLANO.md`. Corrija só se estiver errado. NÃO altere o texto do Prompt A (é histórico).
6. No bloco "PRÓXIMO PASSO" do MELHORIA-PLANO.md: confirme que o próximo passo é a M-07 e que cita o caminho novo.
7. Na descrição da tarefa M-07 dentro do MELHORIA-PLANO.md, acrescente ao final, sem apagar nada: ` (O passo de mover o MELHORIA-PLANO.md e trocar os caminhos já foi feito no REPARO de caminho; ver LOG.)`
Se alguma referência não se encaixar com clareza em (R), (H) ou (X), NÃO edite: me pergunte.

## Passo 5 — Registrar no LOG (append, uma linha nova no fim da seção LOG do MELHORIA-PLANO.md)
Use `Get-Date -Format "yyyy-MM-dd HH:mm"` para a data. Texto:
[DATA] REPARO (fora do ciclo de M) — MELHORIA-PLANO.md movido de plano-de-acao/ para plano-de-melhoria/; skill em skills/SKILL-MELHORIA-PLANO.md; referências ativas corrigidas; escopo da skill inclui plano-de-melhoria/. Entradas anteriores do LOG citam os caminhos antigos (histórico, não alteradas).
Não altere nenhuma linha antiga do LOG.

## Passo 6 — Verificação (rode e relate)
1. Test-Path nos dois destinos novos: devem ser True; nas origens antigas: False.
2. Procure caminhos antigos que sobraram:
Get-ChildItem -Recurse -File -Include *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.git\\' } | Select-String -Pattern 'plano-de-acao[/\\]MELHORIA-PLANO|skills[/\\]scripts[/\\]SKILL-MELHORIA'
Só podem restar: linhas antigas do LOG, o texto do Prompt A no CENTRAL_IDEA.md, e o README.md da raiz. Qualquer outra sobra é um erro seu: corrija ou relate.
3. Verifique texto corrompido (acentos quebrados) nos arquivos que você editou: Select-String -Pattern 'Ã|Â|�' neles. Deve dar zero resultados.
4. Rode `py plano-de-acao/plan_tool.py status` (somente leitura) e relate: não pode ter dado erro.
5. Rode `git status --short`. Devem aparecer só arquivos .md (movidos/modificados).

## Passo 7 — Relatório final e PARADA
Entregue: (1) onde cada arquivo estava e onde está agora; (2) lista de linhas alteradas (arquivo:linha, antes → depois); (3) o que sobrou com o caminho antigo e por quê; (4) saída do status e do git status; (5) qualquer dúvida. Ofereça, sem executar, os comandos `git add .` (na raiz) e `git commit -m "docs(plan): relocate MELHORIA-PLANO to plano-de-melhoria and fix references"`. Depois PARE. Não continue para nenhuma M.

Se em qualquer passo você não conseguir fazer algo sozinho, me ensine, com comandos exatos, como eu faço manualmente.

Depois que ela terminar
Confira a saída do git status: só pode aparecer .md.
Faça o commit de que ela falou. É um bom checkpoint antes da M-07.
Use este Prompt B (igual ao anterior, com uma trava de segurança):
Leia skills/SKILL-MELHORIA-PLANO.md e plano-de-melhoria/MELHORIA-PLANO.md e siga o ciclo da skill. Se algum desses dois arquivos não existir nesses caminhos, PARE e me avise sem tentar adivinhar. Execute APENAS a próxima tarefa M pendente (ou termine a que estiver em [~]). Não altere código, não commite, não faça push. Ao final: log, resumo, `git status`, oferta de `git add .` na raiz, e PARE perguntando se devo continuar.

Duas observações:

O README com o caminho antigo vai ficar quebrado até a M-13, e isso é aceitável porque o bloco é interno. Ninguém executa esse prompt a partir do README.
Se ela cair no caso B do Passo 1 (arquivo nos dois lugares), me traga o que ela mostrar, porque aí tem algo que eu não previ.

Sim, ajudam bastante. O LOG ao lado do MELHORIA-PLANO.md é o que torna possível retomar com qualquer IA.

Onde paramos
Concluídas: M-00 a M-06. A última entrada do LOG é FIM M-06 às 22:33.
Próxima: M-07 (hierarquia dos documentos e links absolutos).
Ainda não registrado no LOG: a sua mudança manual dos dois arquivos para plano-de-melhoria/.
Reparo de caminhos ainda não feito. O trecho da skill que você colou ainda manda ler plano-de-acao/MELHORIA-PLANO.md (ciclo, passo 2, e a seção "Conflitos e dúvidas"). Esse é exatamente o erro que o prompt de reparo corrige, então o próximo passo é rodá-lo.
Um ajuste no prompt de reparo

O LOG está dentro de um bloco de código (```). Se a IA acrescentar a linha depois do fechamento, ela fica fora do bloco. Cole este trecho no Passo 5 do prompt:

ATENÇÃO no Passo 5: a seção LOG está dentro de um bloco de código delimitado por ```. Acrescente a nova linha ANTES do ``` de fechamento, mantendo o mesmo formato das linhas anteriores.
O que o LOG revela e merece atenção depois
F-09: os cartões de T-028 em diante não têm o campo "Objetivo". São cerca de 67 cartões, então a M-09 vai ser pesada. Peça para dividir a M-09 em partes por fase (M-09a, M-09b...), no mesmo esquema de quebra que já fizemos.
F-10 (Pausa): não precisa de um campo "Pausa" em cada cartão, desde que cada cartão aponte para a regra do RETOMAR.md. Peça só essa referência.
F-15 (LIMIT interpolado): é a candidata real a SQL injection, que era a sua preocupação inicial. Peça para a M-08 propor uma tarefa de correção antes do ORM, e não esperar a Fase 5.
M-05 durou 2 minutos, contra 9 a 21 minutos das outras. Pode estar certo, porque o servidor é pequeno, mas confira por amostragem antes de confiar nos F-15 a F-21:
Get-ChildItem server\src -Recurse -Include *.js | Select-String -Pattern 'LIMIT\s*\$\{|OFFSET\s*\$\{'
.env na raiz do repositório. Verifique que ele nunca foi commitado: git log --all --oneline -- .env. A saída deve ser vazia. A tarefa T-089 já deve cobrir isso, mas vale checar agora, porque o repositório é público.
Pequena correção minha: eu disse que a D-10 parava na Fase 9. Pelo LOG (M-03), o ts-fsrs já estava nela. O que falta continua sendo o Playwright, as libs de OpenAPI e a cobertura. A auditoria da M-08 vai confirmar isso.
Sequência daqui para frente
Prompt de reparo, com o ajuste acima.
git status (só .md), git add . na raiz e commit.
Prompt B atualizado, para a M-07.
Na M-08, a primeira coisa é a auditoria de pacotes por cartão. Depois vêm as tarefas novas (incluindo a do LIMIT).

Relatório Final do Reparo de Caminhos Todos os passos foram executados rigorosamente na ordem especificada, sem executar tarefas M ou T, sem commit e sem alterar arquivos de código. 1. Onde cada um dos três arquivos está CENTRAL_IDEA.md : plano-de-melhoria/CENTRAL_IDEA.md (12.294 bytes)

PASTED

Esse foi o resultado.
Há algum problema?

E isso ainda merece atenção?
O que o LOG revela e merece atenção depois

F-09: os cartões de T-028 em diante não têm o campo "Objetivo". São cerca de 67 cartões, então a M-09 vai ser pesada. Peça para dividir a M-09 em partes por fase (M-09a, M-09b...), no mesmo esquema de quebra que já fizemos.
F-10 (Pausa): não precisa de um campo "Pausa" em cada cartão, desde que cada cartão aponte para a regra do RETOMAR.md. Peça só essa referência.
F-15 (LIMIT interpolado): é a candidata real a SQL injection, que era a sua preocupação inicial. Peça para a M-08 propor uma tarefa de correção antes do ORM, e não esperar a Fase 5.
M-05 durou 2 minutos, contra 9 a 21 minutos das outras. Pode estar certo, porque o servidor é pequeno, mas confira por amostragem antes de confiar nos F-15 a F-21: Get-ChildItem server\src -Recurse -Include *.js | Select-String -Pattern 'LIMIT\s*\$\{|OFFSET\s*\$\{'
.env na raiz do repositório. Verifique que ele nunca foi commitado: git log --all --oneline -- .env. A saída deve ser vazia. A tarefa T-089 já deve cobrir isso, mas vale checar agora, porque o repositório é público.
Pequena correção minha: eu disse que a D-10 parava na Fase 9. Pelo LOG (M-03), o ts-fsrs já estava nela. O que falta continua sendo o Playwright, as libs de OpenAPI e a cobertura. A auditoria da M-08 vai confirmar isso.

O reparo ficou quase todo certo. Os arquivos estão nos lugares certos, o git status mostra só .md, a skill já permite editar plano-de-melhoria/, os links foram testados e o status continua em 4/94 com a T-002 como próxima. As sobras com o caminho antigo são todas históricas (Prompt A e entradas antigas do LOG), então não é erro.

Antes do commit, confira três coisas
Bloco de código solto no README. O trecho removido mostra a abertura do bloco (bash com três crases), mas o relatório não mostra o fechamento. Se sobrou um fechamento solto, todo o README depois dele vira "bloco de código" no GitHub.
O diff do README. git diff README.md deve mostrar só a remoção desse bloco. Se aparecer outra coisa, são edições suas antigas.
O Prompt B da linha 101 do CENTRAL_IDEA.md ficou sem a trava de segurança ("Se algum desses dois arquivos não existir… PARE"), enquanto o do PRÓXIMO PASSO tem. Padronize para a versão com a trava.

Um detalhe menor: o Prompt A no CENTRAL_IDEA.md (linhas 55 a 63) ainda manda criar arquivos nos caminhos antigos. Ele já foi usado, então vale marcar "USADO, não reutilizar" na M-15.

Sobre a minha lista anterior

Tudo continua valendo. Os itens 1 a 3 e o 6 são para a IA tratar quando chegar a hora, e os itens 4 e 5 são conferências que você pode fazer agora, junto com as de cima, no mesmo prompt:

Tarefa SOMENTE DE LEITURA, com uma única exceção descrita no item 2. Não rode plan_tool.py, não execute nenhuma M nem T, não altere código, não commite, não faça push. Use o PowerShell do Windows.

1. README.md: conte as linhas que começam com três crases: (Select-String -Path README.md -Pattern '^\s*```').Count. O número deve ser PAR. Mostre as linhas 340 a 370 do README.
2. Se houver uma linha de três crases SOLTA (sem abertura correspondente) logo onde um bloco foi removido (em torno das linhas 354-360), remova SOMENTE essa linha e relate. Se houver qualquer dúvida, não edite: mostre e pergunte.
3. Rode `git diff README.md` e relate se o diff é só a remoção do bloco "PROMPT DE MELHORIA DO PROJETO / Prompt B".
4. Em plano-de-melhoria/CENTRAL_IDEA.md, linha 101 (Prompt B): acrescente, depois de "siga o ciclo da skill.", a frase: "Se algum desses dois arquivos não existir nesses caminhos, PARE e me avise sem tentar adivinhar." Não altere mais nada.
5. Segredos (repositório público): rode e mostre a saída completa de
   git log --all --oneline -- .env
   git ls-files | Select-String '(^|/)\.env$'
   git check-ignore -v .env
   git ls-files | Select-String '\.(dump|backup|bak)$'
   O esperado é: o primeiro comando vazio, o segundo vazio, o terceiro mostrando a regra do .gitignore, o quarto vazio. NÃO mostre o conteúdo do .env.
6. SQL: rode e mostre a saída completa de
   Get-ChildItem server\src -Recurse -Include *.js | Select-String -Pattern 'LIMIT\s*\$\{|OFFSET\s*\$\{'
   Get-ChildItem server\src -Recurse -Include *.js | Select-String -Pattern 'err\.message'
   Para cada resultado, diga se o valor interpolado é validado (por exemplo parseInt) ou vem direto de req.query/req.body/req.params.
Ao final, relate o resultado de cada item e PARE.
Como cada item da lista fica tratado
Item	O que fazer
1. F-09 (cartões sem "Objetivo")	Na sessão da M-08, peça para dividir a M-09 em partes por fase (M-09a, M-09b…), de forma aditiva, para não estourar tokens.
2. F-10 (Pausa)	Uma linha em cada cartão apontando para o protocolo do RETOMAR.md, em vez de um campo novo.
3. F-15 (LIMIT interpolado)	Na M-08, peça uma tarefa pequena [P] para parametrizar LIMIT e OFFSET e tirar err.message das respostas, antes do ORM (na Fase 2 ou 7). Isso precisa de uma autorização sua, porque a skill só permite add-feature com ordem explícita. Eu recomendo autorizar só para esta tarefa e para as falhas de teste conhecidas.
4. Conferir o F-15	O item 6 do prompt acima faz essa conferência.
5. .env	O item 5 do prompt acima. Se o histórico mostrar o .env, avise antes de qualquer commit: aí é preciso trocar a senha do banco.
6. D-10	A auditoria da M-08 confirma.
Sequência
Cole o prompt de conferência acima.
Se tudo estiver certo, rode o git add . na raiz e faça o commit que ela sugeriu. Os arquivos aparecerão como renomeados.
Para a M-07, use o Prompt B (já com a trava):
Leia plano-de-melhoria/SKILL-MELHORIA-PLANO.md e plano-de-melhoria/MELHORIA-PLANO.md e siga o ciclo da skill. Se algum desses dois arquivos não existir nesses caminhos, PARE e me avise sem tentar adivinhar. Execute APENAS a próxima tarefa M pendente (ou termine a que estiver em [~]). Não altere código, não commite, não faça push. Ao final: log, resumo, `git status`, oferta de `git add .` na raiz, e PARE perguntando se devo continuar.
No Prompt B da M-08, acrescente no fim esta autorização:
Autorização extra para esta M-08: você PODE usar `py plano-de-acao/plan_tool.py add-feature` apenas para (a) parametrizar LIMIT/OFFSET e tirar err.message das respostas da API, antes do ORM, e (b) as falhas de teste conhecidas do client e do server. Todo o resto continua como proposta no MELHORIA-PLANO.md. Divida a M-09 em partes por fase (M-09a, M-09b...), sem renumerar nada, e peça que cada cartão do TAREFAS.md aponte para o protocolo de pausa do RETOMAR.md em vez de ter um campo próprio.

Se o item 5 mostrar qualquer coisa fora do esperado, me traga a saída antes de continuar. É o único ponto aqui que pode ser sério, por causa do repositório público.


A análise da IA de apoio é muito lúcida e as preocupações dela foram todas verificadas agora mesmo no ambiente.

Aqui está o diagnóstico detalhado de cada ponto e a conferência realizada:

1. Resultado das Conferências de Integridade e Segurança
Item	Verificação	Resultado	Situação
1. Três crases no README	Contagem com Select-String -Pattern '^\s*```'	18 ocorrências (número par)	✅ Perfeito, blocos de código balanceados.
2. Fechamento solto no README	Linhas finais (300 a 326) conferidas	Seção termina limpa na licença MIT sem crases soltas	✅ Sem artefatos.
3. Diff do README	git diff README.md	0 diferenças	✅ Sincronizado e limpo.
4. Trava no Prompt B	Linha 101 de 

CENTRAL_IDEA.md
Frase "Se algum desses dois arquivos não existir nesses caminhos, PARE e me avise sem tentar adivinhar." está presente	✅ Proteção ativa.
5. Segredos (.env e backups)	git log --all --oneline -- .env
git ls-files | Select-String '(^|/)\.env$'
git check-ignore -v .env
git ls-files | Select-String '\.(dump|backup|bak)$'	Histórico limpo (vazio); arquivos rastreados limpos (vazio); protegido pela regra .gitignore:8:.env; nenhum dump/backup commitado	✅ Segurança 100% preservada. Nenhuma credencial foi exposta no repositório público.
6. SQL (LIMIT e err.message)	LIMIT\s*\$\{|OFFSET\s*\$\{
err\.message	Identificado em server/src/routes/reviews.js:320: LIMIT ${parseInt(limit)} (se inválido vira NaN). Identificadas 40 ocorrências de err.message no backend	✅ Confirmado. Excelente candidato para tarefa antes do ORM.
2. O que isso muda e como faremos na M-08
Todas as orientações da conversa fazem total sentido e serão incorporadas na M-08:

Auditoria Pacote × Cartão (1º Passo):

Comparar todos os cartões de 

TAREFAS.md
 com a lista de dependências D-10 do 

PLANO.md
, incorporando formalmente os pacotes já aprovados na M-06 (ts-fsrs, Playwright, Zod, OpenAPI, cobertura Vitest/Jest, etc.).
Criação das Tarefas com a Autorização Explícita:

Com a autorização extra que você fornecerá no prompt da M-08, usaremos plan_tool.py add-feature para:
Adicionar uma tarefa [P] antes do ORM (na Fase 2 ou 7) para parametrizar LIMIT/OFFSET e implementar tratamento central de erros sem vazar err.message.
Adicionar tarefa para corrigir as falhas de teste conhecidas (srs.test.js, tts.test.js e o status red→yellow do server).
Divisão da M-09 (Prevenção de Estouro de Contexto):

Como os cartões de T-028 a T-094 precisam de ajuste de formatação no campo Objetivo e apontamento para a regra de pausa do 

RETOMAR.md
, dividiremos a M-09 em subtarefas aditivas por fase (M-09a, M-09b...), sem renumerar as tarefas T existentes.
Campo de Pausa Simplificado (F-10):

Em vez de um campo proprietário duplicado em 94 cartões, cada cartão apontará diretamente para o protocolo canônico do 

RETOMAR.md
.
3. Estado Atual do Git
text
On branch v2/phase-01-safety-net
Your branch is ahead of 'origin/v2/phase-01-safety-net' by 2 commits.
  (use "git push" to publish your local commits)
nothing to commit, working tree clean
(Os commits da M-07 já foram gravados localmente e a árvore está 100% limpa).

Pronto para a M-08!
Quando quiser iniciar, basta colar o Prompt B com a autorização complementar:

text
Leia plano-de-melhoria/SKILL-MELHORIA-PLANO.md e plano-de-melhoria/MELHORIA-PLANO.md e siga o ciclo da skill. Se algum desses dois arquivos não existir nesses caminhos, PARE e me avise sem tentar adivinhar. Execute APENAS a próxima tarefa M pendente (ou termine a que estiver em [~]). Não altere código, não commite, não faça push. Ao final: log, resumo, git status, oferta de git add . na raiz, e PARE perguntando se devo continuar.
Autorização extra para esta M-08: você PODE usar `py plano-de-acao/plan_tool.py add-feature` apenas para (a) parametrizar LIMIT/OFFSET e tirar err.message das respostas da API, antes do ORM, e (b) as falhas de teste conhecidas do client e do server. Todo o resto continua como proposta no MELHORIA-PLANO.md. Divida a M-09 em partes por fase (M-09a, M-09b...), sem renumerar nada, e peça que cada cartão do TAREFAS.md aponte para o protocolo de pausa do RETOMAR.md em vez de ter um campo próprio.