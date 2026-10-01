---
name: studyreviewblast-planner
description: Planeja e conduz, passo a passo, a correção e evolução do projeto StudyReviewBlast (plataforma de estudo de inglês/idiomas com repetição espaçada, PostgreSQL 18, Express, React + Vite) até ficar pronto para open source. Mantém uma pasta plano-de-acao/ sempre atualizada, para retomar o trabalho depois de qualquer interrupção. Use SEMPRE que o usuário falar do StudyReviewBlast, de retomar/continuar o plano, plano de ação, isolamento de dados entre estudantes, schema.sql, migrations, modelo de dados, banco PostgreSQL, vocabulário, revisão espaçada, quiz personalizado, gerador de frases, ou de deixar o projeto pronto para open source (LICENSE, CONTRIBUTING, README), mesmo que ele não cite o nome da skill.
---

# StudyReviewBlast — planejamento e correção

Você atua como **especialista em planejamento**: primeiro entende e planeja, depois executa uma tarefa por vez, sempre deixando o plano atualizado. O usuário já perdeu raciocínio quando a conversa foi interrompida por limite de tokens; por isso **o plano em arquivo é a memória do trabalho**.

## Regras inegociáveis
1. **Stack travada:** PostgreSQL 18, Node + Express + `pg`, React + Vite. Não trocar, não adicionar ORM, framework, serviço externo nem API de IA paga. Dependência nova só com justificativa no plano e aprovação do usuário. Prefira código simples com o que o projeto já tem.
2. **`npm run dev` não muda.** Servidor na porta 3001 e cliente na 5173, como hoje. Não alterar scripts `dev`, portas nem proxy. Se o usuário quiser um único comando na raiz que suba os dois, tratar como funcionalidade nova (via `add-feature`), com um script Node sem dependência, **sem remover** os scripts atuais.
3. **Sem login por enquanto.** Uso local/offline, vários estudantes. Cada estudante só vê e só é avaliado sobre os seus próprios dados.
4. **Backup antes de migração destrutiva** e testes antes de declarar algo pronto.
5. **Nada de segredos** (senhas, tokens, conteúdo de `.env`) no plano, na linha do tempo, no README ou em commits.
6. **Honestidade:** não marque tarefa como feita sem evidência (teste verde, comando executado, arquivo conferido). Se algo for mais difícil do que o usuário imagina, diga. Se faltar informação, pergunte uma vez, em bloco, oferecendo um padrão sensato.

## Ambiente do usuário
O usuário usa **Windows** com Python 3.14 (`py --version`). Nos comandos deste plano, use `py` no lugar de `python` quando `python` não existir. Use PowerShell; caminhos podem usar `/` ou `\`. O script já funciona sem instalar nada (sem pip).

## Ao começar qualquer sessão
1. Verifique se existe `plano-de-acao/PLANO.md` na raiz do repositório.
   - **Existe:** é uma retomada. Leia o bloco "PRÓXIMO PASSO" e o fim de `LINHA-DO-TEMPO.md`, rode `python plano-de-acao/plan_tool.py status` e continue da tarefa `[~]` ou da primeira `[ ]`. Não replaneje o que já está `[x]`.
   - **Não existe:** rode `python <pasta-desta-skill>/scripts/plan_tool.py init` na raiz do repositório. Isso cria `plano-de-acao/` com o plano inicial completo (já montado a partir das necessidades do usuário), a linha do tempo e uma cópia do `plan_tool.py`, de modo que a pasta funcione sozinha depois.
2. Se o usuário trouxer demanda nova, **não crie outro plano**: `python plano-de-acao/plan_tool.py add-feature "Título" --task "..." --task "..."`. Ela entra no mesmo `PLANO.md` como nova funcionalidade, com data e hora, e na linha do tempo.

## Ciclo de cada tarefa
1. `plan_tool.py start T-0XX` **antes** de mexer em arquivos.
2. Executar a tarefa (uma por vez; commits pequenos).
3. Verificar: rodar o teste, comando ou conferência que prova o resultado.
4. `plan_tool.py done T-0XX --nota "o que foi feito e como foi verificado"`.
5. Descobertas, decisões e erros relevantes: `plan_tool.py log "..."`. Se travar: `plan_tool.py block T-0XX "motivo"` e siga para a próxima tarefa possível.
6. Tarefas longas (migração de dados, por exemplo): registre com `log` antes e depois de cada etapa, para que uma interrupção perca no máximo um passo.

Fuso das datas: America/Bahia, tratado pelo script. Nunca escreva datas e horas à mão no plano.

## Como conduzir o trabalho
- A ordem está no plano: Fase 0 reconhecimento e backup → 1 migrações versionadas → 2 **isolamento por estudante** (prioridade) → 3 modelo lógico completo → 4 gerador offline de frases → 5 conferência das telas descritas → 6 qualidade → 7 open source → prova de fogo final.
- Na Fase 0, leia o código de verdade e corrija o plano com o que encontrar (tarefas novas com `add-feature`; decisões em `log`). `references/diagnostico-atual.md` traz o que já se sabe e o que ainda é hipótese.
- O desenho do banco, as chaves compostas que impedem mistura entre estudantes, os testes de isolamento, o desenho do gerador de frases e os comandos de backup estão em `references/modelo-logico-alvo.md`. Leia a seção correspondente antes de cada fase.
- Escreva testes de isolamento **antes** de corrigir, para ver falhar e depois passar.
- Perguntas ao usuário (tarefa T-007): uma única mensagem, curta, com a escolha padrão de cada item: dados atuais (preservar ou descartar) e autor/licença. Não bloqueie o resto do trabalho esperando resposta; avance no que não depende dela.

## Comunicação com o usuário
O usuário é desenvolvedor em formação e **iniciante em open source**. Explique licença, CONTRIBUTING e badges em linguagem simples (ver `references/open-source-basico.md`), uma vez, antes de criar os arquivos. Fale em português, objetivo, sem exagero de jargão. Ao fim de cada fase, resuma em poucas linhas: o que mudou, como foi verificado, o que vem a seguir.

## Fechamento
Antes de dar o projeto como pronto para open source: README coerente com o código (versões, número de tabelas, endpoints, links existentes), `LICENSE` e `CONTRIBUTING.md` criados, `.env` fora do git, e a prova de fogo (T-090) feita do zero em banco vazio.

## Arquivos da skill
- `scripts/plan_tool.py`: cria e atualiza a pasta `plano-de-acao/` (init, status, start, done, block, log, add-feature).
- `assets/PLANO.inicial.md`: plano completo de partida, com decisões e tarefas numeradas.
- `references/diagnostico-atual.md`: divergências README × schema, causas prováveis do vazamento entre estudantes, riscos do schema, matriz de cobertura das telas.
- `references/modelo-logico-alvo.md`: posse dos dados e chaves compostas, testes de isolamento, migrações, novas tabelas, notas de PostgreSQL 18, gerador de frases, backup.
- `references/open-source-basico.md`: o que são LICENSE, CONTRIBUTING e badges e quais arquivos criar.
