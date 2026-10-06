---
name: security-scanner
description: Varre o backend (server/src/) em busca de vulnerabilidades recorrentes de segurança (SQL injection, vazamento de err.message, credenciais em logs, ausência de helmet/rate-limit, rotas destrutivas sem autenticação). Gera achados no formato SEC-xx e propõe cartões M para correção. Deve ser acionada sempre que código novo for adicionado ao servidor ou antes de qualquer revisão de segurança formal.
---

# Skill: Security Scanner (Varredura de Segurança Contínua)

Esta skill é uma **barreira de auditoria de segurança** para o projeto. Quando acionada, ela executa uma bateria de verificações estáticas no código-fonte do servidor e na configuração do projeto, gerando relatórios de achados no formato padronizado `SEC-xx`. Ela **NÃO corrige o código diretamente** — ela planeja, e a correção é delegada a tarefas T ou a cartões M.

---

## Regras Inegociáveis

1. **Nunca altere código diretamente.** Esta skill é de leitura e planejamento. Toda correção deve ser transformada em cartão M ou T via `gerador-de-m`.
2. **Filtro de Autoconsciência:** Antes de gerar novos achados, verifique se já existe um SEC-xx ou M-xx aberto para o mesmo problema no `MELHORIA-PLANO.md`. Não duplique achados já registrados.
3. **Respeite o contexto local:** O projeto é "100% local por padrão" (Decisão D-18). Não proponha soluções que enviem dados para serviços externos (ex: WAF na nuvem).
4. **Referencie a Regra Global §3** (Segurança e Privacidade Estrita) em cada achado gerado. Isso garante rastreabilidade da exigência.

---

## Bateria de Verificações (Checklist de Varredura)

Execute cada verificação abaixo em ordem. Para cada problema encontrado, crie um achado `SEC-xx` no formato definido na seção **Formato de Achado**.

### V-01 · Interpolação Direta em Queries SQL

**O que procurar:** Variáveis de `req.query`, `req.params` ou `req.body` usadas diretamente em template strings de SQL — especialmente `LIMIT`, `OFFSET`, `ORDER BY`, e parâmetros de filtro.

**Varredura:** Buscar por: `` LIMIT ${ `` ou `` OFFSET ${ `` ou `` ORDER BY ${ `` nos arquivos `.js` de `server/src/routes/` e `server/src/services/`.

**Critério de aprovação:** Todo valor dinâmico deve usar bound parameters (`$1`, `$2`, ...) passados no array de parâmetros. Nunca interpolação de string.

**Referência de risco:** Mesmo `parseInt()` não é suficiente — use `$N` sempre.

---

### V-02 · Vazamento de `err.message` em Respostas HTTP

**O que procurar:** Ocorrências de `err.message` dentro de objetos `res.status(5xx).json(...)` nos arquivos de rotas e middleware.

**Varredura:** Buscar por `err.message` em `server/src/routes/` e `server/src/middleware/`.

**Critério de aprovação:** Em produção (`NODE_ENV !== 'development'`), a resposta HTTP de erro deve retornar apenas `{ error: 'Internal Server Error' }`. O `err.message` real deve ir apenas para `console.error` no servidor.

**Impacto:** Vazar `err.message` expõe schema do banco, nomes de colunas, constraints e stack traces para qualquer cliente HTTP.

---

### V-03 · Credenciais e Infraestrutura em `console.log`

**O que procurar:** `console.log` ou `console.error` que imprimam variáveis de ambiente como `DB_NAME`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `PORT`, ou URLs de conexão.

**Varredura:** Buscar por `process.env.DB_` combinado com `console.log` em `server/src/index.js` e `server/src/db/`.

**Critério de aprovação:** Logs de startup podem indicar que o servidor está rodando, mas nunca devem exibir dados de conexão com o banco. Substituir por mensagem genérica (ex: `DB: connected`).

---

### V-04 · Ausência de Headers de Segurança HTTP (`helmet`)

**O que procurar:** Verificar se `helmet` está instalado (`package.json`) e configurado no `server/src/index.js` antes das rotas.

**Varredura:** Buscar `helmet` em `server/package.json` e `server/src/index.js`.

**Critério de aprovação:** `app.use(helmet())` deve aparecer como **primeiro middleware** no `index.js`, antes de `cors()` e `express.json()`. Configura automaticamente: CSP, X-Frame-Options, XSS-Protection, HSTS, X-Content-Type-Options.

---

### V-05 · Ausência de Rate Limiting

**O que procurar:** Verificar se `express-rate-limit` (ou equivalente) está instalado e configurado para rotas críticas.

**Rotas prioritárias:**
- `POST /api/students` (criação de estudante)
- `POST /api/reviews` (submissão de revisão)
- `GET /api/reviews/queue` (consulta pesada)

**Critério de aprovação:** Mesmo em uso local, rate limiting protege contra loops acidentais de cliente que disparem centenas de requisições/segundo, corrompendo o banco.

---

### V-06 · Rotas Destrutivas sem Verificação de Identidade

**O que procurar:** Endpoints `DELETE` que não verificam se o recurso pertence ao estudante logado antes de deletar, ou que não usam o middleware `requireStudent`.

**Critério de aprovação:**
- `DELETE /api/students/:id` — rota especial (sem auth por design). Verificar se existe proteção mínima ou confirmação no frontend.
- Todos os outros `DELETE` devem usar `requireStudent` e verificar `student_id = $sid` antes de executar.

---

### V-07 · `.env` e Segredos no `.gitignore`

**O que procurar:** Verificar se `.env` está listado no `.gitignore` da raiz. Verificar se `.env.example` não contém valores reais.

**Critério de aprovação:** Regra Global §3 — "Zero Senhas no Git". Qualquer `.env` real rastreado pelo git é uma **falha CRÍTICA**.

---

## Formato de Achado (SEC-xx)

```
### SEC-XX · [Título Curto]
- **Severidade:** CRÍTICA | ALTA | MÉDIA | BAIXA
- **Arquivo(s):** `server/src/routes/exemplo.js:linha`
- **Regra violada:** Global §3 (Segurança e Privacidade)
- **Descrição:** [O que foi encontrado, em 1–3 frases]
- **Evidência:** `trecho de código real`
- **Ação proposta:** Gerar cartão M-XX ou T-XXX via `gerador-de-m`
```

---

## Fluxo de Execução

1. **Leia** `server/src/index.js`, `server/src/routes/*.js`, `server/src/middleware/*.js`, `server/package.json`, `.gitignore`.
2. **Execute** cada verificação V-01 a V-07 em sequência.
3. **Documente** cada achado no formato `SEC-xx`, incrementando a partir do último SEC-xx já registrado no `MELHORIA-PLANO.md`.
4. **Filtre duplicatas:** Se o achado já tem um SEC-xx ou M-xx aberto, marque como "já rastreado" sem duplicar.
5. **Gere o relatório** com: contagem total, lista por severidade, e proposta de próximos passos.
6. **PAUSE** imediatamente. Apresente o relatório ao usuário e aguarde autorização para transformar achados em cartões M via `gerador-de-m`.

---

## Quando Acionar Esta Skill

- Após adição de novas rotas (`server/src/routes/*.js`)
- Antes de qualquer PR ou revisão de código
- Sempre que uma T-task modificar arquivos de middleware ou configuração do servidor
- Periodicamente (recomendado: início de cada nova Fase do projeto)
- Quando o usuário mencionar: "segurança", "auditoria", "vulnerabilidade", "SQL injection", "vazamento", "credencial", "helmet", "rate limit", "SEC-xx"
