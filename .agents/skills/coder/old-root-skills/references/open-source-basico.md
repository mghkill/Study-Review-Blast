# Open source para quem está começando

O usuário disse que nunca ouviu falar de licença, CONTRIBUTING e badges. Explique em linguagem simples, sem jargão, uma vez, e só crie os arquivos depois de ele confirmar.

## O que é cada coisa
- **LICENSE (licença):** arquivo que diz o que os outros podem fazer com o código. Sem ele, mesmo o código estando público no GitHub, ninguém tem permissão legal de usar, copiar ou modificar. O README já declara a licença **MIT**: a mais simples e comum; permite que qualquer pessoa use, copie e modifique o projeto, inclusive em projetos fechados, desde que mantenha o aviso de autoria. Precisa do **ano** e do **nome do autor** (perguntar; não inventar). Outras opções (Apache-2.0, GPL-3.0, AGPL-3.0) só se ele quiser mais restrição.
- **CONTRIBUTING.md:** guia para quem quer ajudar. Diz como instalar, rodar os testes, como nomear branches e commits e como abrir um Pull Request. O README atual já tem um link para esse arquivo; se ele não existir, o link está quebrado.
- **Badges:** pequenas etiquetas coloridas no topo do README (licença, versão do Node, etc.). São opcionais e só enfeitam; só podem aparecer se forem verdadeiras. Badge de CI ou de cobertura só se esse serviço realmente existir.

## O que criar, em ordem de importância
1. `LICENSE` (MIT, após confirmar autor e ano).
2. `CONTRIBUTING.md` sob medida: PostgreSQL 18, `npm install` em `server/` e `client/`, `.env`, `npm run migrate`, `npm run seed`, `npm run dev`, testes (`npm test`, `npm run test:run`, `npm run lint`), padrão de commit (`feat:`, `fix:`, `docs:`).
3. `.gitignore` e `.env.example` corretos. Garantir que nenhum `.env` real foi commitado.
4. README coerente com o projeto real (versões, tabelas, endpoints, links).
5. Opcional, com aprovação: `CODE_OF_CONDUCT.md`, `SECURITY.md`, modelos de issue e de pull request.

## Cuidados
- Dados pessoais em seeds (nome real do estudante inicial) ou no histórico do git: avisar e perguntar.
- A pasta `plano-de-acao/` pode ir para o repositório público; por isso nunca contém segredos.
