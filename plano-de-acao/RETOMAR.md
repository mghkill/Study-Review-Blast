# Como retomar (leia só isto e o status)
1. Rode `py plano-de-acao/plan_tool.py status` (use `python` se `py` não existir).
2. Leia somente o bloco "PRÓXIMO PASSO" de plano-de-acao/PLANO.md e as últimas 15 linhas de plano-de-acao/LINHA-DO-TEMPO.md.
3. Rode `git status --short` e `git log -3 --oneline` para confirmar se o último passo foi concluído de verdade. Se a tarefa [~] ficou pela metade, refaça a verificação dela antes de continuar.
4. Continue da tarefa [~] ou da primeira [ ]. Não replaneje o que está [x].

## Economia de tokens
- Não releia arquivos inteiros: use busca e faixas de linhas. Não releia skills/SKILLENG.md; as regras estão aqui. Abra skills/references/ só na seção da tarefa atual.
- Limite a saída dos comandos (ex.: `| Select-Object -First 30`) e rode testes em modo resumido.
- Respostas curtas: até 4 linhas por tarefa. Não repita o plano.

## Regras
- Uma tarefa por vez: start → executar → verificar → done com nota. Nunca marcar como feita sem evidência. Atualize o plano antes e depois de cada passo; use `log` para decisões e erros.
- Commit local por tarefa concluída (sem push), com mensagem feat:, fix:, docs: ou chore:. Sem git, apenas salve o plano.
- Pare no fim de cada fase e espere eu escrever "continuar".
- Antes de T-023 e de qualquer comando que apague dados: confirme que o backup de T-005 existe e peça meu OK.
- Não troque PostgreSQL 18, Express, React nem Vite. Não altere `npm run dev` nem as portas 3001 e 5173. Sem dependência nova sem me perguntar.
- Credenciais: leia do `.env` (DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD). A senha vale só em PGPASSWORD na sessão; nunca imprima nem grave no plano, em logs, em commits ou na conversa.
- Se o contexto estiver acabando: atualize o plano e registre com `log` onde parou e o próximo passo exato.
- Responda em português.
