# Modelo de Isolamento por Estudante e Limitações de Segurança

## Visão Geral

O **StudyReviewBlast** é uma aplicação open source concebida primordialmente para execução local e pessoal (*desktop/self-hosted*). Para permitir que múltiplos estudantes ou perfis de estudo utilizem a mesma instalação sem misturar baralhos, fila de repetição espaçada (SRS), métricas ou anotações, foi implementada uma arquitetura de isolamento lógico de ponta a ponta.

---

## Como o Isolamento Funciona

1. **Posse no Banco de Dados (PostgreSQL)**:
   - Toda entidade dependente de estudante (`vocabulary_items`, `student_vocabulary`, `reviews`, `errors`, `sentences`, `contexts`, `paragraphs`, `study_sessions`) possui a coluna `student_id NOT NULL`.
   - Chaves estrangeiras compostas (ex.: `(vocabulary_item_id, student_id) REFERENCES vocabulary_items(id, student_id)`) garantem integridade referencial intransponível mesmo contra bugs de software.
   - Remoção em cascata (`ON DELETE CASCADE`) vinculada ao estudante garante que ao excluir um estudante, nenhum resíduo permaneça no banco.

2. **Middleware na API REST (`requireStudent`)**:
   - Todas as rotas autenticadas da API passam pelo middleware `requireStudent`, que exige o cabeçalho HTTP `X-Student-Id`.
   - Se o cabeçalho for omitido, a resposta é `400 Bad Request`.
   - Se o ID não existir na tabela `students`, a resposta é `404 Not Found`.
   - As queries SQL utilizam estritamente o valor de `req.studentId` resolvido pelo middleware. Parâmetros de identificação vindos no corpo da requisição ou em query string são desconsiderados.
   - Tentativas de acessar, editar ou excluir itens de outro estudante respondem invariavelmente `404 Not Found`.

3. **Cliente React**:
   - O Axios interceptor em `client/src/api.js` injeta o header `X-Student-Id` dinamicamente a partir do perfil ativo.
   - Trocar de estudante redefine o layout e as rotas com `key={student.id}`, forçando a desmontagem e remontagem completa dos componentes e expurgando qualquer estado residual em memória.

---

## Limitação de Segurança

> [!WARNING]
> **Ausência de Autenticação por Senha / Criptografia:**
> O sistema opera em modo **sem login** (sem senhas, JWT, sessões com cookies seguros ou controle de acesso baseado em papéis).
> 
> - **O que este modelo protege**: Separa com total fidelidade os dados de cada estudante na interface gráfica e na camada de persistência, evitando qualquer cruzamento acidental ou contaminação de vocabulário e métricas SRS entre perfis.
> - **O que este modelo NÃO protege**: Não protege contra qualquer pessoa ou processo com acesso ao ambiente onde o app está sendo executado. Um usuário com acesso às ferramentas de desenvolvedor do navegador (DevTools), ao terminal ou à rede local pode forjar requisições HTTP alterando manualmente o valor do cabeçalho `X-Student-Id`.

### Recomendações para Ambientes Compartilhados ou Nuvem
Caso o projeto venha a ser implantado em servidores públicos ou na nuvem com múltiplos usuários reais:
1. Implementar autenticação formal (ex.: OAuth2, OpenID Connect ou JWT com Bcrypt/Argon2).
2. Substituir a leitura direta do `X-Student-Id` pela extração do ID a partir de um token de sessão assinado e verificado criptograficamente no servidor.
