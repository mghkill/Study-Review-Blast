# Plano de Melhoria do Planejamento — StudyReviewBlast

> Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` feita · `[!]` bloqueada

---

## PRÓXIMO PASSO

Cole o Prompt B para iniciar a **M-13**:

> Leia plano-de-melhoria/SKILL-MELHORIA-PLANO.md e plano-de-melhoria/MELHORIA-PLANO.md e siga o ciclo da skill. Se algum desses dois arquivos não existir nesses caminhos, PARE e me avise sem tentar adivinhar. Execute APENAS a próxima tarefa M pendente (ou termine a que estiver em [~]). Não altere código, não commite, não faça push. Ao final: log, resumo, git status, oferta de git add . na raiz, e PARE perguntando se devo continuar.

---

## Achados (F-xx)

### F-01 · Inventário de arquivos .md e .py (resultado da M-01)

#### Raiz do repositório
| Arquivo | Bytes | Classif. | Função |
|---|---|---|---|
| `README.md` | 16.905 | **ATIVO** | Guia mestre do projeto: visão geral, stack, fases, decisões |
| `.env.example` | 166 | ATIVO | Modelo de variáveis de ambiente |
| `.gitignore` | 171 | ATIVO | Proteção de arquivos sensíveis |
| `migrate_session_type.js` | 915 | **⚠️ ÓRFÃO** | Script de migração avulso na raiz — não pertence a `server/src/db/migrations/`; T-019 prevê remoção |

#### plano-de-acao/ (ativos)
| Arquivo | Bytes | Classif. | Função |
|---|---|---|---|
| `RELATORIO-GERAL-PROJETO.md` | 22.422 | **ATIVO** | Guia arquitetural e de conduta para IAs |
| `PLANO.md` | 17.957 | **ATIVO** | Fases, tarefas, decisões, dependências |
| `TAREFAS.md` | 69.384 | **ATIVO** | 94 cartões detalhados |
| `RETOMAR.md` | 5.292 | **ATIVO** | Protocolo diário e regras de pausa |
| `LINHA-DO-TEMPO.md` | 10.774 | **ATIVO** | Log cronológico imutável |
| `PROMPT_ORIGINAL.md` | 14.216 | **HISTÓRICO** | Instruções primitivas do projeto (referência) |
| `plan_tool.py` | 8.220 | **ATIVO** | Script CLI de planejamento (status, start, done, log) |

#### plano-de-melhoria/ (ativos de melhoria)
| Arquivo | Bytes | Classif. | Função |
|---|---|---|---|
| `CENTRAL_IDEA.md` | 12.403 | **ATIVO** | Ideia central e prompts de execução (Prompt A e B) |
| `MELHORIA-PLANO.md` | ~38.000 | **ATIVO** | Este plano de melhoria (criado na M-00) |
| `SKILL-MELHORIA-PLANO.md` | 3.559 | **ATIVO** | Skill das sessões de melhoria (criada na M-00) |

#### plano-de-acao/legado/
| Arquivo | Bytes | Classif. | Função |
|---|---|---|---|
| `PLANO-v1.md` | 13.402 | **LEGADO** | Plano antigo V1 (congelação) |
| `RETOMAR-v1.md` | 3.492 | **LEGADO** | Protocolo antigo do V1 em inglês |
| `PLANO.inicial-v1.md` | 9.073 | **LEGADO** | Template inicial bruto |
| `MAPA-V1-V2.md` | 12.910 | **ATIVO** | De-para de tarefas V1 → V2 (ainda é consultado) |
| `PROMPT_INICIAL_LEGADOV2.md` | 6.477 | **HISTÓRICO** | Prompt mestre que ordenou a reconstrução |
| `RELATORIO-RECONSTRUCAO-V2.md` | 13.605 | **HISTÓRICO** | Registro técnico da transição V1 → V2 |

#### skills/
| Arquivo | Bytes | Classif. | Função |
|---|---|---|---|
| `SKILLENG.md` | 6.078 | **ATIVO** | Diretrizes técnicas da IA planejadora |
| `skill.md` | 8.355 | **ATIVO** | Diretrizes de documentação e README open source |
| `assets/README.template.md` | 3.837 | **ATIVO** | Template de documentação profissional |
| `references/convencoes-v2.md` | 4.831 | **ATIVO** | Padrões de código, branches e commits |
| `references/diagnostico-atual.md` | 4.539 | **HISTÓRICO** | Análise preliminar pré-V1 |
| `references/modelo-logico-alvo.md` | 10.067 | **ATIVO** | Schema alvo e status das migrations |
| `references/open-source-basico.md` | 2.114 | **ATIVO** | Guia conceitual de licença MIT e badges |
| `references/open-source-checklist.md` | 3.108 | **ATIVO** | Checklist de lançamento público |
| `scripts/plan_tool.py` | 8.220 | **⚠️ DUPLIC.** | Cópia de `plano-de-acao/plan_tool.py` — manter sincronizada |
| `scripts/detect_stack.py` | 11.654 | **ATIVO** | Analisador automático de stack e dependências |

#### server/src/db/migrations/
| Arquivo | Bytes | Classif. | Função |
|---|---|---|---|
| `001_baseline.sql` a `009_language_code.sql` | vários | **ATIVO** | 9 migrations versionadas e aplicadas |
| `README.md` | 102 | **⚠️ MÍNIMO** | Apenas 1 linha de descrição; sem inventário das migrations; **sugestão: manter** (não remove) — seria útil detalhar cada migration |

### F-02 · Duplicações identificadas
- `plano-de-acao/plan_tool.py` e `skills/scripts/plan_tool.py` — conteúdo idêntico (8.220 bytes); RELATORIO-GERAL §2 documenta que a de `skills/scripts/` é a "cópia mestre", mas não há mecanismo de sincronização. Risco: dessincronia silenciosa. Q-01 gerada.

### F-03 · Arquivo órfão na raiz
- `migrate_session_type.js` (915 bytes) — script de migração avulso na raiz. Não é chamado por nenhum script npm nem pelo migrador. T-019 prevê remoção explícita. Não remover agora.

### F-04 · migrations/README.md tem função mínima
- Contém apenas "Pasta para migrações versionadas..." (102 bytes / 1 linha útil). Função existe mas é mínima. RELATORIO-GERAL §2 lista-o explicitamente; removê-lo quebraria a árvore documentada. **Sugestão: manter e enriquecer** (listar cada migration com data e objetivo) — pode ser proposta de T nova.

### F-05 · PROMPT_ORIGINAL.md sem posição na hierarquia
- `plano-de-acao/PROMPT_ORIGINAL.md` (14.216 bytes) é classificado como HISTÓRICO mas não está em `legado/`. Não há nota de "somente leitura". Pode gerar confusão. Q-02 gerada.

### F-06 · diagnostico-atual.md sem classificação explicitada
- `skills/references/diagnostico-atual.md` (4.539 bytes) é classificado como `[Histórico]` no RELATORIO-GERAL §2, mas está na pasta ativa `references/`. Sem nota de somente leitura. Q-03 gerada.

### F-07 · plano-de-melhoria/ — pasta fora do escopo
- Existe `plano-de-melhoria/` na raiz (contém `CENTRAL_IDEA.md`). Não é citada no RELATORIO-GERAL §2 nem em nenhum outro documento de planejamento. É um órfão do ponto de vista da hierarquia oficial. Q-04 gerada.

### F-08 · plan_tool.py status — confirmado
- `py plano-de-acao/plan_tool.py status`: 4/94 (4%) · PRÓXIMA: T-002. Consistente com PLANO.md. ✅

### F-09 · TAREFAS.md — contagem de cartões
- **94 cartões** confirmados: T-001 a T-094, sem faltar nem repetir. ✅
- Cartões **T-016, T-017 e T-050** são stubs de tarefas concluídas no legado — texto mínimo ("Concluída no v1, nada a executar"), sem campos Back/Front/Teste/Pronto. Isso é intencional e aceitável para tarefas legado.
- **Tamanho P/M:** presente em 91 cartões ativos (os 3 stubs legado não têm, o que é aceitável). ✅
- **Campo "Objetivo":** o campo se chama **`- **Objetivo:**`** nos primeiros cartões (T-001 a T-015, T-018 a T-027), mas nas tarefas de T-028 em diante o campo Objetivo **não existe como `**Objetivo:`** — o objetivo está incorporado ao texto introdutório do cartão ou ausente como campo explícito. ⚠️ **Achado F-09a:** inconsistência de formato entre cartões das Fases 1–5 e Fase 5+ (cartões de T-028 a T-094 não têm `**Objetivo:**` separado). Impacto: a skill manda ler só o campo objetivo; se ele não existe, a IA pode interpretar o cartão de forma incompleta.

### F-10 · TAREFAS.md — campo "Pausa" ausente como campo explícito
- Nenhum cartão tem campo `**Pausa:**` ou `**Pausa obrigatória:**` separado. A pausa é coberta pelo campo `**Commit:**` e pelas referências a `RETOMAR.md`. O CENTRAL_IDEA.md menciona "pausa" como campo obrigatório, mas o formato atual o incorpora no `**Commit:**`. ⚠️ Achado de inconsistência de nomenclatura entre o que CENTRAL_IDEA.md descreve e o que o arquivo usa.

### F-11 · plan_tool.py init — dependência de arquivo inexistente
- `cmd_init` (linha 125): `src = SKILL_DIR / "assets" / "PLANO.inicial.md"` — o arquivo `skills/assets/PLANO.inicial.md` **não existe** no disco. Só existe `plano-de-acao/legado/PLANO.inicial-v1.md`.
- Impacto: o comando `py plano-de-acao/plan_tool.py init` quebraria com FileNotFoundError se chamado hoje. O `init` não é necessário na prática atual (o plano já existe), mas é um bug latente. ⚠️ Q-05 gerada.

### F-12 · RELATORIO-GERAL §2 vs disco — conferência
| Afirmação do §2 | Verificação |
|---|---|
| 9 migrations (001–009) existem | ✅ Confirmado |
| `server/src/db/migrator.js` existe | ✅ |
| `server/src/db/migrate.js` existe | ✅ |
| `server/src/db/seed.js` existe | ✅ |
| `server/src/db/connection.js` existe | ✅ |
| `migrations/README.md` existe | ✅ |
| `migrate_session_type.js` na raiz | ✅ (F-03 confirma como órfão) |
| `skills/assets/PLANO.inicial.md` implícita em plan_tool | ❌ Arquivo não existe (F-11) |

### F-13 · RELATORIO-GERAL §3 — estado atual confirmado
- 4 tarefas concluídas (T-001, T-016, T-017, T-050) — consistente com `plan_tool.py status` (4/94). ✅
- Migrações 001–009 todas presentes e documentadas no §3. ✅
- Banco de testes separado ainda não criado (D-12 Proposto) — §3 não afirma que existe. ✅

### F-14 · Checklist de conformidade R-01..R-16 (resultado da M-03)

Fontes consultadas: `PROMPT_ORIGINAL.md`, `legado/PROMPT_INICIAL_LEGADOV2.md`, `PLANO.md`, `TAREFAS.md`, `RETOMAR.md`, `README.md`

| Código | Requisito | Status | Evidência |
|---|---|---|---|
| R-01 | Reaproveita o plano V1 e preserva histórico em `legado/` | ✅ | `legado/` existe com PLANO-v1.md, MAPA-V1-V2.md; PLANO.md L7–8 referencia legado; TAREFAS.md stubs T-016/017/050 |
| R-02 | Tarefas pequenas (P ou M), uma por sessão | ✅ | PLANO.md L7: "Tarefa grande é proibida: divide-se"; 91 cartões com `[P]` ou `[M]` |
| R-03 | Todo T inclui o front (ou justificativa) | ✅ | Todos os 91 cartões ativos têm `**Front:**`; stubs legado justificam "sem impacto" |
| R-04 | Teste escrito antes e visto falhando | ✅ | PLANO.md L21; TAREFAS.md: todos os 91 cartões têm `**Teste antes:**` |
| R-05 | Pausa com `git add .` na raiz, sem push, commit em inglês | ✅ | RETOMAR.md §3; PLANO.md L20; TAREFAS.md: todos os 91 cartões têm `**Commit:**` |
| R-06 | Nada pago no plano | ✅ | `grep pago/ElevenLabs/OpenAI/Sentry` no PLANO.md → zero resultados; RETOMAR.md L105: "Nada pago" |
| R-07 | ORM + qualidade (lint, hooks, CI, Zod, segurança, logs) + proteção SQL injection | ✅ | Fase 2 (T-006–T-011 lint/CI), Fase 5 (T-025–T-035 ORM+regra anti-SQL), Fase 7 (T-042–T-049 Zod/Helmet/Pino); T-035 tem "regra lint que proíbe SQL por concatenação" |
| R-08 | Tradução para inglês planejada e não executada, com i18n | ✅ | D-08 (PLANO.md L39); Fase 9 (T-054–T-063); D-16 (PLANO.md L47); `i18next` em D-10 Fase 9 |
| R-09 | Estudo estilo Anki + FSRS + dashboard + voz gratuita | ✅ | Fase 10 T-067 (Anki), T-064/T-065 (FSRS); Fase 11 T-079/T-080 (voz gratuita Web Speech API); Fase 10 T-075/T-076 (dashboard) |
| R-10 | README como guia mestre (onde parei, prompt por T, decisões simples, melhorias pós-T-090) | ✅ | README.md tem seções "Como prosseguir", prompt por tarefa, "Decisões explicadas", "Melhorias pós-prova de fogo" |
| R-11 | `RETOMAR.md` é ponto de entrada diário, funciona ao trocar de IA | ✅ | RETOMAR.md §7 "Como retomar após troca de IA ou limite de tokens" (L115–L122) |
| R-12 | READMEs sem função de `client/` e `server/` removidos | ✅ | `Test-Path client\README.md` → False; `Test-Path server\README.md` → False |
| R-13 | Prova de fogo final | ✅ | Fase 14 T-092: "Clone limpo + banco vazio, seguir o README como um estranho" |
| R-14 | Dependências só da lista aprovada cobrindo TODAS as fases | ⚠️ | D-10 (PLANO.md L51–62) lista Fases 2,3,5,6,7,9,10,12,13. **Lacuna**: Fase 1 (nenhuma dep nova, ok); Fase 4 (nenhuma dep nova, ok); Fase 8 (nenhuma dep nova, ok); Fase 11 (Web Speech API é nativa, ok); Fases 14/15 (nenhuma dep nova, ok). A lista está completa por fase ✅ — mas conforme F-02 da M-00, `ts-fsrs` só aparece em D-14 como proposta ainda não confirmada, enquanto D-10 linha 60 já a lista. **Inconsistência**: D-14 diz "Requer confirmação antes da Fase 10", mas D-10 já incluiu `ts-fsrs`. |
| R-15 | Portas, proxy e scripts dev intactos | ✅ | PLANO.md L19: "porta **3001**" e "porta **5173**"; RETOMAR.md L101-102 confirma |
| R-16 | Nenhum segredo nos documentos | ⚠️ | LINHA-DO-TEMPO.md L19 e L23 mencionam "senha" em contexto de log de ação (não é segredo real, é narrativa). TAREFAS.md L27 menciona `C:\Users\opera\studyreviewblast-backups\` (caminho local, não senha). PROMPT_ORIGINAL.md L30 contém instrução sobre credenciais (educativo, não é segredo real). **Avaliação: nenhum segredo real está exposto** ✅ — as menções são instrucionais. |

**Achados críticos da M-03:**
- ⚠️ R-14: `ts-fsrs` está em D-10 (aprovada) mas D-14 ainda diz "Proposto — requer confirmação antes da Fase 10". Inconsistência que precisa ser resolvida na M-08.
- Todos os demais R-xx estão em conformidade.

### F-15 · SQL por concatenação (resultado da M-05)
- Filtros dinâmicos concatenam a string, mas **com placeholders `$n` e `params.push`**, ou seja, são parametrizados ✅: `server/src/routes/vocabulary.js:43-48`, `sentences.js:23-25`, `reviews.js:54-56`.
- ⚠️ `server/src/routes/reviews.js:320`: `LIMIT ${parseInt(limit)}` é interpolado. Não abre injeção, mas `parseInt` inválido vira `LIMIT NaN`, que gera erro de SQL (e esse erro vaza, ver F-16).
- Coberto por: T-035 (regra lint anti-SQL concatenado). A interpolação do LIMIT não tem T específica → proposta para M-08.

### F-16 · Erros que vazam SQL/mensagem interna
- `res.status(500).json({ error: err.message })` em **~35 pontos**: `routes/vocabulary.js` (10×), `sentences.js` (6×), `reviews.js` (5×), `students.js` (5×), `sessions.js` (3×), `dashboard.js:108`, `tenses.js:13`, `middleware/requireStudent.js:29`, `index.js:37` (handler global) e `index.js:30` (`/health` expõe `db: err.message`).
- O client repassa a mensagem ao usuário via `alert`: `client/src/pages/StudentSelect.jsx:35,48`, `VocabDetail.jsx:257,270`, `StudySession.jsx:467,484,554`, `AddVerb.jsx:38`.
- Nenhuma T dedicada encontrada → propor T de "handler de erro central sem vazar detalhes" na M-08.

### F-17 · Rotas sem validação de entrada
- 15 usos de `req.body` nas rotas; nenhuma lib de validação em `server/package.json` (sem zod/joi/express-validator). Validações são manuais e pontuais.
- Provável cobertura pela fase de OpenAPI/ORM; confirmar na M-06 qual lib (entra na lista D-10).

### F-18 · Testes quebrados conhecidos
- `TAREFAS.md:618` move testes do client e `utils/tts.js` para inglês, mas **nenhum cartão cita explicitamente** consertar `client/src/test/srs.test.js`, testes de TTS nem o teste de status red→yellow do server. → propor T na M-08 (já previsto no texto da M-08).

### F-19 · Extensão pgcrypto sem uso
- `CREATE EXTENSION IF NOT EXISTS "pgcrypto"` em `server/src/db/migrations/001_baseline.sql:7` e `server/src/db/schema.sql:7`.
- Nenhum uso de `gen_random_uuid`, `crypt(` ou `digest(` nos `.sql`/`.js` do server. Extensão ociosa; decidir na M-06 (manter para uso futuro ou remover em migration nova).

### F-20 · Textos em português e acentos
- Mensagens em português no server (`db/migrate.js`, `db/migrator.js`, `db/seed.js`) e no client (alerts acima). Coerente com i18n planejado (R-08); a tradução fica para as T de i18n/Fase 15.
- Busca por mojibake (`Ã£`, `Ã§`, `Ã©`...) nos `.js/.jsx/.sql/.css/.html`: **0 ocorrências** ✅. Os `�` vistos no terminal são da codificação do PowerShell, não do arquivo.

### F-21 · `console.log`
- 28 ocorrências, todas no server: `db/seed.js` (14), `db/migrate.js` (7), `db/migrator.js` (4), `index.js:42-44` (banner), `db/connection.js:42` (log de query — conferir se roda em produção). Client: 0.
- Scripts de CLI (seed/migrate) são aceitáveis; `connection.js:42` deve ir para logger/nível debug → propor na M-08.




## Lacunas do legado (L-xx)

### L-01 · MAPA linha de V1 T-001 — destino ambíguo
- `MAPA-V1-V2.md` L12: V1 T-001 (`Ler package.json...`) tem destino `— / incorporado no legado`. Não tem tarefa V2 correspondente numerada. O MAPA usa `—` como destino, o que é aceitável (conhecimento incorporado), mas a coluna V2 está vazia. **Não é lacuna crítica** — o conhecimento existe na LINHA-DO-TEMPO (L6-8). ⚠️ Sugestão para M-14: clarificar o texto do MAPA nessa linha (ex.: "incorporado na LINHA-DO-TEMPO L6-8").

### L-02 · MAPA linha de V1 T-001 tem símbolo estranho
- `MAPA-V1-V2.md` L12: o campo status exibe `✅ — / incorporado no legado` com barra (`/`) — provavelmente artefato de edição. Menor, mas pode confundir. A corrigir na M-14.

### L-03 · V1 tarefas concluídas sem evidência individual na LINHA-DO-TEMPO V1 para T-016 e T-017
- T-016 e T-017 no V2 são stubs marcados como concluídos. A evidência está nos arquivos de migração em disco (001–009 existem ✅) e na LINHA-DO-TEMPO L64 ("Plano V2 construído..."). Não há entradas individuais `[T-016] concluída` na LINHA-DO-TEMPO. Aceitável (foram concluídas antes do V2 ser estruturado), mas a rastreabilidade é indireta. Registrar como L-03 para awareness.

### L-04 · V1 T-050 — stubs sem evidência direta na LINHA-DO-TEMPO V2
- V1 T-020 a T-030 → V2 T-050 (stub). Evidências em disco: `requireStudent.js` ✅, `isolation.test.js` ✅, `X-Student-Id` em `api.js` ✅, migrations 002–005 ✅. LINHA-DO-TEMPO L64 registra o agrupamento. Rastreabilidade indireta mas suficiente. Não é lacuna crítica.

### L-05 · MAPA — tarefas V1 pendentes sem destino explícito
- V1 T-044 a T-048 (Fase 3 pendentes): o MAPA mapeia T-044→T-020, T-045→T-021, T-046→T-022, T-047→T-023, T-048→T-024. Todos os destinos existem em TAREFAS.md com conteúdo real ✅.
- V1 T-050 a T-054 (Fase 4, gerador): mapeia para T-072, T-073, T-074 — todos existem ✅.
- V1 T-060, T-061 (Fase 5): mapeia para T-004, T-078 — existem ✅.
- V1 T-070 a T-073 (Fase 6): mapeia para T-077, T-042, T-043–T-045, T-084 — todos existem ✅.
- V1 T-080 a T-087, T-090 (Fases 7 e final): mapeia para T-087, T-089, T-091, T-092 — todos existem ✅.
- **Resultado: nenhuma tarefa V1 pendente ficou sem destino no V2.** ✅

### Resumo da auditoria M-04
- ✅ Todas as tarefas V1 concluídas (`[x]`) têm evidência no disco.
- ✅ Todas as tarefas V1 pendentes têm destino mapeado em TAREFAS.md com conteúdo real.
- ⚠️ L-01 e L-02: o MAPA tem texto ambíguo/artefato na linha de V1 T-001 — cosmético, corrigir na M-14.
- ⚠️ L-03 e L-04: rastreabilidade de T-016, T-017 e T-050 é indireta (via LINHA-DO-TEMPO L64 e evidências em disco) — aceitável.



---

## Perguntas para o usuário (Q-xx)

> Conflitos, ambiguidades e decisões pendentes que requerem resposta do usuário. Não avançar sem resposta.

**Q-01** `plan_tool.py` existe em dois lugares (`plano-de-acao/` e `skills/scripts/`). O RELATORIO-GERAL §2 diz que `skills/scripts/` é a "cópia mestre", mas sem sincronização automática. Qual deve ser a fonte única? Sugestão: manter só a de `plano-de-acao/` (que é a usada operacionalmente) e transformar `skills/scripts/plan_tool.py` em um link simbólico ou removê-la (com nota).

**Q-02** `PROMPT_ORIGINAL.md` está em `plano-de-acao/` mas é HISTÓRICO. Deve ser movido para `legado/` para manter a pasta operacional limpa? Ou deve permanecer onde está com uma nota de "somente leitura"?

**Q-03** `skills/references/diagnostico-atual.md` é marcado como `[Histórico]` no RELATORIO-GERAL, mas não tem nenhuma nota nele mesmo. Deve ser mantido sem alteração, receber uma nota de histórico no cabeçalho, ou ser movido?

**Q-04** A pasta `plano-de-melhoria/` (contendo `CENTRAL_IDEA.md`) existe na raiz mas não é citada em nenhum documento oficial do projeto. Deve ser mencionada no RELATORIO-GERAL ou README (como "pasta temporária de ideias"), ou pode ser ignorada pelo plano de melhoria?

**Q-05** `plan_tool.py init` (linha 125) aponta para `skills/assets/PLANO.inicial.md` que não existe no disco. O `init` não é usado na prática atual. A recomendação é: (a) corrigir o caminho apontando para `plano-de-acao/legado/PLANO.inicial-v1.md`, ou (b) remover/documentar o comando como obsoleto. Qual preferir?

---

## Pendências consolidadas (M-06) — ✅ RESPONDIDAS pelo usuário em 2026-10-03 22:32

| # | Pendência | Decisão final |
|---|---|---|
| 1 | **D-11** Docker | **Decidido.** Docker Desktop já instalado e rodando (verificado: `Docker version 29.5.2`, `Docker Compose version v5.1.3`; o `docker` não está no PATH do terminal da IDE, só em `C:\Program Files\Docker\Docker\resources\bin`). T-014 pode usar Docker, mas: (a) PostgreSQL 18 publicado em porta de host diferente da do PostgreSQL local (ex.: `5433:5432`); (b) README e CI funcionam também SEM Docker; (c) nenhuma outra T depende do Docker; (d) o cartão diz se o banco de testes (D-12) roda no contêiner ou no PostgreSQL local |
| 2 | **D-12** Banco de testes | ok: banco próprio `<DB_NAME>_test`, nunca o de desenvolvimento |
| 3 | **D-13** Branches | ok: uma branch por fase `v2/phase-NN-slug`, PR e merge no fim da fase |
| 4 | **D-14** Algoritmo de revisão | ok: FSRS (`ts-fsrs`) — resolve a incoerência D-10 × D-14 (F-14/R-14) |
| 5 | **D-15** Idioma padrão | ok: detectar navegador, padrão `en`, seletor `en`/`pt-BR` |
| 6 | **D-16** Planejamento em inglês | **OPCIONAL**, só depois da T-092 (prova de fogo), **SEM renomear a pasta `plano-de-acao/`** |
| 7 | **D-17** Lint do client | ok: Oxlint no client, ESLint no server, Prettier nos dois |
| 8 | **D-18** Voz × "100% local" | ok (opcional, desligado por padrão, aviso do Chrome/Google, "100% local por padrão") **+** a interface prefere vozes com `localService=true`; trocar "análise fonética/pontuação de precisão" por "comparação entre o falado e o esperado" em todos os .md |
| 9 | **D-10** lista incompleta | ok: `ts-fsrs`, `@playwright/test`, `zod`, `@asteasolutions/zod-to-openapi`, `swagger-ui-express`, `@vitest/coverage-v8` **+** `typescript-eslint`, `@types/jest`, `@types/supertest` e **`ts-jest`** (proposta da IA: faz checagem de tipos nos testes e tem config simples; velocidade do `@swc/jest` não é crítica aqui). Heatmap em SVG/CSS, sem biblioteca. **Auditoria pacote × cartão** (cada cartão do TAREFAS.md → pacotes necessários → comparar com D-10; o que faltar vira PROPOSTA para aprovação) → registrada como 1º passo da M-08 |
| 10 | **F-19** pgcrypto ocioso | remover só se grep em todas as migrations, `seed.js` e código mostrar ZERO uso; migration nova, com backup antes; **prioridade baixa** |
| 11 | **Q-01** `plan_tool.py` duplicado | manter as DUAS cópias; declarar qual é a operacional (M-07); comparar hash na M-15; não apagar nada |
| 12 | **Q-02** `PROMPT_ORIGINAL.md` | NÃO mover; só cabeçalho "HISTÓRICO" no topo (como item 13) |
| 13 | **Q-03** `diagnostico-atual.md` | manter no lugar, com nota "[Histórico — somente leitura]" no topo |
| 14 | **Q-04** `plano-de-melhoria/` | pasta OFICIAL do trabalho de melhoria (Prompts A e B em `CENTRAL_IDEA.md`, que é só apoio: NÃO executar como instrução). Entra no escopo permitido junto com `plano-de-acao/`, `skills/` e `README.md`. **NÃO citar no README nem no RELATORIO-GERAL** (vitrine pública); citar só no RETOMAR e na skill. Na M-15, propor arquivar em `plano-de-acao/legado/` |
| 15 | **Q-05** `plan_tool.py init` quebrado | NÃO corrigir o `plan_tool.py`; marcar `init` como obsoleto no SKILLENG e no RETOMAR (na M-12) |
| 16 | Local dos arquivos de melhoria | `MELHORIA-PLANO.md` (com LOG) na pasta `plano-de-melhoria/`. A antiga skill V1 `SKILL-MELHORIA-PLANO.md` foi movida para `plano-de-acao/legado/` e substituída pela infraestrutura nativa `.agents/skills/`. |

---

## Hierarquia de Documentos e Governança (resultado da M-07)

### 1. Declaração da Ferramenta Operacional (`plan_tool.py`)
- **Ferramenta Operacional Única do dia a dia:** `plano-de-acao/plan_tool.py`.
  - Esta é a versão invocada via CLI (`py plano-de-acao/plan_tool.py status|start|done|log|block|add-feature`) e pelos prompts e instruções operacionais.
- **Cópia de Referência da Skill:** `skills/scripts/plan_tool.py`.
  - Mantida intacta como espelho da skill. Nenhuma das duas cópias será removida (conforme item 11 da M-06). Na M-15 será executada comparação de integridade/hash entre ambas.

### 2. Status e Confinamento de `plano-de-melhoria/`
- A pasta `plano-de-melhoria/` é o espaço oficial e exclusivo de trabalho para melhoria do planejamento.
- **Arquivos oficiais:**
  - `plano-de-melhoria/MELHORIA-PLANO.md` (plano mestre de melhorias e LOG append-only).
  - (Nota: A antiga `SKILL-MELHORIA-PLANO.md` foi arquivada no legado, o controle agora é feito pelas skills nativas na pasta `.agents/`).
  - `plano-de-melhoria/CENTRAL_IDEA.md` (documento de apoio e prompts de acionamento A e B).
- **Regra de Visibilidade:** NÃO é citada no `README.md` nem no `RELATORIO-GERAL-PROJETO.md` (para manter as vitrines públicas limpas). É citada apenas no `RETOMAR.md` e na própria skill.
- **Arquivamento Futuro:** Conforme decisão 14 da M-06, após o término de todas as melhorias (ao fim da M-15), a pasta será proposta para arquivamento histórico em `plano-de-acao/legado/`.

### 3. Estatuto de `plano-de-acao/legado/` (Somente Leitura)
- Todos os arquivos sob `plano-de-acao/legado/` (`PLANO-v1.md`, `RETOMAR-v1.md`, `PLANO.inicial-v1.md`, `PROMPT_INICIAL_LEGADOV2.md`, etc.) são **estritamente SOMENTE LEITURA e congelados historicamente**.
- Nenhuma alteração retroativa é permitida, exceto os ajustes cosméticos de alinhamento do de-para em `MAPA-V1-V2.md` e `RELATORIO-RECONSTRUCAO-V2.md` reservados com exclusividade para a tarefa **M-14** (L-01 a L-05).

### 4. Matriz de Autoridade: Qual Arquivo Manda em Quê

A governança do repositório opera em dois regimes complementares: o **Ciclo de Melhoria do Planejamento (Fase M)** e o **Ciclo de Execução Operacional (Fase T)**. A precedência e a autoridade máxima de cada documento estão formalizadas abaixo:

| Precedência | Documento | Esfera de Autoridade Máxima (Manda em quê) |
|---|---|---|
| **0 (Meta-Regulação Ativa)** | `plano-de-melhoria/SKILL-MELHORIA-PLANO.md` | **Regulação Suprema das Sessões de Melhoria:** Durante a vigência das tarefas M (M-01 a M-15), dita o protocolo de cada sessão, o escopo estrito de edição (apenas `.md`), a proibição inegociável de tocar em código, a regra de 1 M por sessão e a pausa com oferta de commit. |
| **0.1 (Fonte da Verdade das Melhorias)** | `plano-de-melhoria/MELHORIA-PLANO.md` | **Diretrizes e Decisões de Refinamento:** Consolida todos os achados (F-xx), lacunas (L-xx), decisões do usuário (M-06), inventário de correções e o LOG cronológico das melhorias. Manda no conteúdo das alterações que serão propagadas para os arquivos operacionais nas etapas M-08 a M-14. |
| **1 (Suprema Operacional)** | `plano-de-acao/RELATORIO-GERAL-PROJETO.md` | **Arquitetura, Visão Alvo e Princípios Cardeais:** Define o que o sistema é e será; regras inegociáveis (100% gratuito/local, isolamento estrito, soberania do PostgreSQL 18); diretrizes gerais para IAs; mapa geral de decisões D-01 a D-18. |
| **2** | `plano-de-acao/RETOMAR.md` | **Conduta Operacional e Protocolo de Execução:** Manda no fluxo da sessão diária de desenvolvimento de código, processo de pausa com `git add .`, verificação prévia, regras de tolerância a falhas de contexto e limites da IA. |
| **3** | `plano-de-acao/PLANO.md` | **Sequenciamento das Fases e Dependências Aprovadas:** Manda na ordem das 15 fases, no ponteiro `## PRÓXIMO PASSO`, nas decisões arquiteturais formais D-xx e na lista oficial de dependências autorizadas (D-10). |
| **4** | `plano-de-acao/TAREFAS.md` | **Especificação Técnica Unitária:** Manda nos requisitos específicos de cada tarefa: critérios de pronto, testes prévios obrigatórios (TDD), escopo de Backend, escopo de Frontend, commits convencionais e dimensionamento (P/M). |
| **5** | `plano-de-acao/LINHA-DO-TEMPO.md` | **Histórico Factual e Evidência Auditável:** Registro append-only imutável de todas as ações executadas, timestamps, hashes de backup e conclusões. Manda na comprovação do que já foi feito. |
| **6** | `skills/SKILLENG.md` & `skills/references/` | **Padrões Técnicos e Engenharia:** Manda em convenções de branch/commit (`convencoes-v2.md`), modelagem relacional (`modelo-logico-alvo.md`) e padrões open source (`open-source-*.md`). |
| **7** | `README.md` (Raiz) | **Interface com o Usuário e Comunicação Externa:** Manda na experiência do desenvolvedor/usuário final que clona o repositório, instruções de instalação, visualização do progresso e backlog de melhorias futuras. |
| **Histórico** | `plano-de-acao/legado/` | **Museu do Plano V1 (Somente Leitura):** Registro imutável das 26 primeiras tarefas e documentos de transição. Sem autoridade executiva no V2, preservado para auditoria e rastreabilidade. |

### 5. Ordem Única e Canônica de Leitura (Para Toda Sessão de Tarefa T)
Para iniciar qualquer sessão de trabalho em tarefas T do plano de ação:
```text
Passo 1: plano-de-acao/RELATORIO-GERAL-PROJETO.md
         └── Ler uma vez no onboarding inicial ou após compactação de contexto / troca de IA.
Passo 2: plano-de-acao/RETOMAR.md
         └── Ler no início de toda sessão: regras do dia e checagem de estado.
Passo 3: plano-de-acao/PLANO.md (bloco ## PRÓXIMO PASSO)
         └── Ler para identificar qual é a próxima T e verificar se há pendências na fase.
Passo 4: plano-de-acao/TAREFAS.md (apenas o bloco ### T-0XX identificado)
         └── Ler o cartão exato da tarefa da sessão (Objetivo, Back, Front, Teste antes, Pronto).
Passo 5: plano-de-acao/LINHA-DO-TEMPO.md (últimas 20 linhas)
         └── Ler para entender o contexto imediato deixado pela sessão anterior.
Passo 6: Executar a checagem no terminal:
         py plano-de-acao/plan_tool.py status
         git status
         git log -3 --oneline
```

### 6. Inventário de Links Absolutos a Substituir por Relativos
Identificados durante a varredura da M-07 para correção nas fases M-09, M-11 e M-12:

| Arquivo Origem | Linha | Conteúdo Absoluto Atual | Correção Relativa Planejada | Tarefa Alvo |
|---|---|---|---|---|
| `plano-de-acao/RELATORIO-GERAL-PROJETO.md` | 152 | `file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/PLANO.md` | `./PLANO.md` | **M-11** |
| `plano-de-acao/RELATORIO-GERAL-PROJETO.md` | 212 | `file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/RETOMAR.md` | `./RETOMAR.md` | **M-11** |
| `plano-de-acao/RELATORIO-GERAL-PROJETO.md` | 214 | `file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/PLANO.md` | `./PLANO.md` | **M-11** |
| `plano-de-acao/RELATORIO-GERAL-PROJETO.md` | 215 | `file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/TAREFAS.md` | `./TAREFAS.md` | **M-11** |
| `plano-de-acao/RELATORIO-GERAL-PROJETO.md` | 235 | `file:///c:/Users/opera/Desktop/Training%20Verbs/plano-de-acao/PLANO.md` | `./PLANO.md` | **M-11** |
| `plano-de-acao/TAREFAS.md` | 27 | `C:\Users\opera\studyreviewblast-backups\` | Generalizar como pasta de backup externa ao repo (ex.: `../studyreviewblast-backups/` ou `$HOME/studyreviewblast-backups/`) | **M-09** |
| `skills/references/convencoes-v2.md` | 45 | `C:\Users\opera\studyreviewblast-backups\` | Generalizar como pasta externa configurável (ex.: `$HOME/studyreviewblast-backups/`) | **M-12** |

---

## Tarefas de Melhoria

### Fase M1 — Varredura (somente leitura)

- [x] **M-01** Inventário — concluído: inventário completo em F-01 a F-07, 2 duplicações, 1 órfão, 4 Q-xx geradas — Listar todos os `.md` e `.py` de `plano-de-acao/`, `skills/`, raiz e `legado/` com tamanho e função; classificar ATIVO / LEGADO / HISTÓRICO; apontar duplicações e arquivos órfãos (inclua `migrations/README.md`: tem função? sugerir manter ou remover, sem remover).
  - Lê: raiz, `plano-de-acao/`, `plano-de-acao/legado/`, `skills/`, `skills/references/`, `skills/assets/`, `skills/scripts/`
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (seção Achados F-xx)

- [x] **M-02** Verdade no disco — concluído: 94 cartões ✅, status 4/94 ✅, §2 e §3 do RELATORIO-GERAL conferidos, achados F-08–F-13, Q-05 gerada — Conferir `plan_tool.py status`; contar cartões em `TAREFAS.md` (esperado 94, T-001 a T-094, sem faltar nem repetir); campos obrigatórios por cartão (objetivo, back, front, teste antes, pronto, tamanho P/M, prompt, pausa); conferir cada afirmação do RELATORIO-GERAL (§2 árvore vs disco, §3 estado, migrations 001–009 existem); verificar se `plan_tool.py init` depende de `skills/assets/PLANO.inicial.md` (só relatar).
  - Lê: `plano-de-acao/TAREFAS.md`, `plano-de-acao/RELATORIO-GERAL-PROJETO.md`, `plano-de-acao/plan_tool.py`, `server/src/db/migrations/`
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (seção Achados F-xx)

- [x] **M-03** Conformidade R-01..R-16 — concluído: 14/16 ✅, R-14 e R-16 com ressalvas menores (⚠️), 0 ❌, achado crítico: D-10 vs D-14 inconsistentes para ts-fsrs. — checklist R-01..R-16 abaixo, cada um ✅/⚠️/❌ com evidência (arquivo e linha).
  - Lê: `plano-de-acao/legado/PROMPT_INICIAL_LEGADOV2.md`, `plano-de-acao/PROMPT_ORIGINAL.md`, `plano-de-acao/PLANO.md`, `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (seção Achados F-xx)


- [x] **M-04** Auditoria do legado — concluído: todas as T V1 com destino e evidência ✅, L-01..L-05 registradas (L-01/L-02 cosméticas, L-03/L-04 rastreabilidade indireta aceitável) — Para cada tarefa de `legado/PLANO-v1.md` (T-001 a T-090, inclusive opcionais), confirmar que o destino em `legado/MAPA-V1-V2.md` existe em `TAREFAS.md` com conteúdo real (não só título) e, para as marcadas concluídas, que há evidência no disco. Tudo sem destino ou sem evidência vira L-xx.
  - Lê: `plano-de-acao/legado/PLANO-v1.md`, `plano-de-acao/legado/MAPA-V1-V2.md`, `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (seção Lacunas L-xx) 

- [x] **M-05** Auditoria de código (SOMENTE LEITURA) — concluído: F-15..F-21; SQL parametrizado (só LIMIT interpolado), ~35 vazamentos de err.message, sem lib de validação, testes quebrados sem T, pgcrypto ocioso, 0 mojibake, 28 console.log no server — SQL montado por concatenação/interpolação de strings; rotas sem validação de entrada; erros que vazam SQL; testes quebrados (client srs/tts, server status red→yellow) e se alguma T cuida deles; extensão pgcrypto sem uso; textos/comentários em português e acentos corrompidos; `console.log`. Resultado: achados F-xx com arquivo:linha. Não alterar código.
  - Lê: `server/src/`, `client/src/`, testes em ambos
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (seção Achados F-xx)

### Fase M2 — Decisões e consistência

- [x] **M-06** Consolidar pendências — concluído: 16 itens respondidos pelo usuário (ver tabela "Pendências consolidadas") — Reunir TODAS as pendências em UMA única pergunta, cada uma com recomendação para o usuário responder "ok" ou trocar: D-11 (Docker), D-12 a D-18, lista D-10 incompleta (ts-fsrs, Playwright, libs de OpenAPI e cobertura), voz vs princípio "100% local" (reconhecimento de fala no Chrome envia áudio ao Google), e quaisquer Q-xx. Depois PARAR e esperar resposta do usuário. **[! Bloqueada até M-05 concluída]**
  - Lê: `plano-de-acao/PLANO.md`, `plano-de-melhoria/MELHORIA-PLANO.md` (todos os Q-xx e F-xx)
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (seção Q-xx)

- [x] **M-07** Hierarquia de documentos — concluído: hierarquia de 7 níveis e ordem única de leitura formalizadas; plano-de-acao/plan_tool.py declarado operacional único; plano-de-melhoria/ confinada e com arquivamento futuro previsto; legado/ ratificado como somente leitura; 7 links/caminhos absolutos mapeados para correção em M-09, M-11 e M-12 — Definir qual arquivo manda em quê e a ORDEM ÚNICA de leitura; marcar legado/ como somente leitura; listar links absolutos a trocar por relativos.
  - Lê: todos os `.md` de `plano-de-acao/` e `skills/`
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md`

### Fase M3 — Aplicação nos .md (um arquivo por M; só depois da M-06 respondida)

- [x] **M-08** `PLANO.md` — concluído: auditoria pacote × cartão concluída; D-11 a D-18 atualizadas para Decidido; D-10 estendida com pacotes TS de teste; novas tarefas T-095 (segurança/LIMIT/sanitização), T-096 e T-097 (correção de testes legados) adicionadas via add-feature com autorização explícita; M-09 dividida em M-09a..M-09d.
  - Lê: `plano-de-acao/PLANO.md`, `plano-de-melhoria/MELHORIA-PLANO.md`
  - Altera: `plano-de-acao/PLANO.md`

- [x] **M-09a** `TAREFAS.md` (Novos cartões e Fases 1 a 4) — concluído: cartões T-095..T-097 criados completos; Fases 1 a 4 (T-001..T-024) padronizadas com objetivo e apontamento canônico de pausa para RETOMAR.md §3; caminho de backup T-002 generalizado.
  - Lê: `plano-de-acao/TAREFAS.md`, `plano-de-melhoria/MELHORIA-PLANO.md`
  - Altera: `plano-de-acao/TAREFAS.md`

- [x] **M-09b** `TAREFAS.md` (Fases 5 a 8: T-025 a T-053) — concluído: 28 cartões das Fases 5 a 8 (T-025 a T-053) padronizados com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3; stub legado T-050 mantido.
  - Lê: `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/TAREFAS.md`

- [x] **M-09c** `TAREFAS.md` (Fases 9 a 11: T-054 a T-081) — concluído: 28 cartões das Fases 9 a 11 (T-054 a T-081) padronizados com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3.
  - Lê: `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/TAREFAS.md`

- [x] **M-09d** `TAREFAS.md` (Fases 12 a 15: T-082 a T-094) — concluído: 13 cartões das Fases 12 a 15 (T-082 a T-094) padronizados com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3; alinhamento de D-16 em T-094.
  - Lê: `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/TAREFAS.md`

- [x] **M-10** `RETOMAR.md` — concluído: alinhado à hierarquia de autoridade da M-07 (matriz de precedência de 10 níveis, 6 passos de leitura canônicos, confinamento de plano-de-melhoria/, plan_tool.py operacional único com init obsoleto e Docker Desktop atualizado).
  - Lê: `plano-de-acao/RETOMAR.md`
  - Altera: `plano-de-acao/RETOMAR.md`

- [x] **M-11** `RELATORIO-GERAL-PROJETO.md` — concluído: links absolutos file:/// substituídos por relativos; §5B e D-18 alinhados à decisão de voz local-first e comparação de fala sem dependência externa; Fase 6 e Visão Alvo harmonizadas com TS incremental (D-07); §6.1 alinhado à ordem canônica de 6 passos; D-11 a D-18 atualizados para Decidido na tabela de decisões.
  - Lê: `plano-de-acao/RELATORIO-GERAL-PROJETO.md`
  - Altera: `plano-de-acao/RELATORIO-GERAL-PROJETO.md`

- [x] **M-12** Skills — concluído: `SKILLENG.md` alinhado à ordem canônica de 6 passos, stack atualizado (D-05, D-07, D-11, D-14, D-18), `plan_tool.py` operacional único documentado com `init` obsoleto e prova de fogo corrigida (T-092); `convencoes-v2.md` com backup externo generalizado e D-16 especificado sem renomeação; `skill.md` alinhado a D-08; `diagnostico-atual.md` marcado explicitamente como somente leitura.
  - Lê: `skills/SKILLENG.md`, `skills/references/convencoes-v2.md`, `skills/skill.md`
  - Altera: os arquivos listados conforme necessário

- [x] **M-13** `README.md` da raiz — Alinhar (onde parei, decisões em linguagem simples, melhorias pós-prova de fogo, observação de tradução para inglês na Fase 15). — concluído: Fase 15 atualizada; referências a plano-de-melhoria/ removidas para não expor workspace de auditoria na vitrine pública.
  - Lê: `README.md`
  - Altera: `README.md`

- [x] **M-14** Legado — Corrigir `legado/MAPA-V1-V2.md` e `legado/RELATORIO-RECONSTRUCAO-V2.md`: correções do mapa (linha V1 T-001; faixas da tabela "100% novas" por listas exatas) e das lacunas L-xx. **[! Bloqueada até M-04]**
  - Lê: `plano-de-acao/legado/MAPA-V1-V2.md`, `plano-de-acao/legado/RELATORIO-RECONSTRUCAO-V2.md`, `plano-de-melhoria/MELHORIA-PLANO.md` (L-xx)
  - Altera: `plano-de-acao/legado/MAPA-V1-V2.md`, `plano-de-acao/legado/RELATORIO-RECONSTRUCAO-V2.md`

- [x] **M-15** Verificação final — Repetir M-02; checar links; `plan_tool.py status`; `git status`; registrar que o planejamento está pronto; entregar o prompt exato para iniciar T-001; propor arquivar `MELHORIA-PLANO.md` em `plano-de-acao/legado/`. **[! Bloqueada até M-08 a M-14]**
  - Lê: todos os `.md` modificados
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (LOG final)

- [x] **M-16** Criação da Skill "Gerador de M" e Arquivo Mestre — Criar a skill nativa `gerador-de-m` em `.agents/skills` e o arquivo `PROMPTS_MESTRES.md` para que todo pedido passe por uma nova tarefa `M`.
  - Lê: `plano-de-melhoria/CENTRAL_IDEA.md`
  - Altera: `.agents/skills/gerador-de-m/SKILL.md` (criação) e `plano-de-melhoria/PROMPTS_MESTRES.md` (novo)

- [x] **M-17** Consolidação das Regras Mestras Globais — Agrupar regras fundamentais (ex: resolução de conflitos, pausar sempre) em um único arquivo consultado nativamente por toda IA.
  - Lê: regras espalhadas no planejamento
  - Altera: `.agents/rules/global_rules.md` (criação)

- [x] **M-16b** Refinamento de Segurança e Triagem de Regras — Varrer o projeto para extrair regras atuais de segurança (zero alucinação, proteção de `.env`, zero senhas em commit) e expurgar regras obsoletas (ex: ausência de ORM).
  - Lê: `RETOMAR.md`, `PROMPT_ORIGINAL.md`, `RELATORIO-GERAL-PROJETO.md`
  - Altera: `.agents/rules/global_rules.md`

- [x] **M-18** Padronização 100% Inglês — Adicionar D-19 (Idioma Técnico) e atualizar diretrizes para que todo código, arquivos e comentários sejam em inglês.
  - Lê: `plano-de-acao/PLANO.md`, `.agents/skills/studyreviewblast-planner/SKILL.md`
  - Altera: os mesmos


- [x] **M-20** Regra de Backup no Legado — Registrar a regra estrita de clone de segurança na pasta de legado antes de qualquer renomeação/exclusão estrutural.
  - Lê: `plano-de-acao/RELATORIO-GERAL-PROJETO.md`
  - Altera: `plano-de-acao/RELATORIO-GERAL-PROJETO.md`

- [x] **M-21** Criação da Skill "Limpador Seguro" (Cleanup) — Criar a skill `safe-cleanup` que obriga a IA a explicar o arquivo antes de deletá-lo e pede autorização.
  - Lê: N/A
  - Altera: `.agents/skills/safe-cleanup/SKILL.md` (criação)

- [x] **M-22** Faxina de Arquivos Obsoletos — Usar a `safe-cleanup` para remover `CENTRAL_IDEA.md`, `PROMPT_ORIGINAL.md` etc., ou enviá-los ao legado.
  - Lê: os arquivos a deletar
  - Altera: sistema de arquivos (deleção/movimentação)

- [x] **M-23** Correção de Bugs Pós-Limpeza — Tarefa de revisão final para consertar eventuais links quebrados ou conflitos gerados pelas renomeações. (Regra de Dependência adicionada ao Doctor).
  - Lê: todos os .md
  - Altera: os .md com bugs

- [x] **M-24** Aprimoramento da Detecção de Skills — Editar a skill `gerador-de-m` para incluir o comando explícito de leitura da pasta de skills, aplicando um filtro de inteligência: reaproveitar skills existentes, criar novas skills apenas para padrões repetitivos, e permitir execução normal para bugs pontuais.
  - Lê: `.agents/skills/gerador-de-m/SKILL.md`
  - Altera: `.agents/skills/gerador-de-m/SKILL.md`

- [x] **M-25** Refatoração Visual do PROMPTS_MESTRES.md — Formatar o catálogo de prompts com blocos de código markdown para permitir a cópia em um clique pelo usuário.
  - Lê: `plano-de-melhoria/PROMPTS_MESTRES.md`
  - Altera: `plano-de-melhoria/PROMPTS_MESTRES.md`

- [x] **M-26** Skills "Markdown Doctor" / "Prompt Updater" e Regra de Atualização — Criar as skills `markdown-doctor` (links) e `prompt-updater` (atualização do catálogo). Adicionar regra global obrigando descoberta prévia de skills e registro de novas skills no mestre.
  - Lê: N/A
  - Altera: `.agents/skills/...`, `.agents/rules/global_rules.md`, `PROMPTS_MESTRES.md`

- [x] **M-27** Atualização do README — Acionar a skill `readme-open-source` para varrer o projeto e atualizar o arquivo `README.md` da raiz com as últimas novidades arquiteturais e o ecossistema de agentes/skills criados.
  - Lê: projeto inteiro, `.agents/skills`
  - Altera: `README.md`

- [x] **M-28** Skill "Project Oracle" (Buscador de Contexto) — Criar a skill permanente `project-oracle`. Objetivo concluído: O `RELATORIO-GERAL-PROJETO.md` foi reescrito para incluir todo o ecossistema de agentes e a nova `global_rules.md` agora obriga a IA a usar o Oráculo antes de responder perguntas gerais. O catálogo mestre foi atualizado.
  - Lê: N/A
  - Altera: `.agents/skills/project-oracle/SKILL.md`, `PROMPTS_MESTRES.md`, `.agents/rules/global_rules.md`, `RELATORIO-GERAL-PROJETO.md`

- [x] **M-29** Skills "Crash Recovery" e "Hierarchy Sync" — Criar a skill permanente `crash-recovery` para recuperar o contexto exato e explicar onde a IA parou caso o sistema caia por limite de tokens. Criar a skill `hierarchy-sync` para garantir que a atualização de documentação siga uma cascata lógica (ex: TAREFAS -> RELATORIO -> README) sem dessincronização. Adicionar regra global obrigando a IA a conferir as tarefas M correlacionadas caso essa hierarquia estrutural mude, prevenindo bugs documentais.
  - Lê: N/A
  - Altera: `.agents/skills/crash-recovery/SKILL.md`, `.agents/skills/hierarchy-sync/SKILL.md`, `.agents/rules/global_rules.md`

- [x] **M-30** Skill "Brain Sync" (Inicialização de Contexto Profundo) — A pedido do usuário, mapear o "estado de inferência" que a IA usou para resolver problemas complexos e cristalizá-lo na skill `brain-sync`. Ela obriga a IA a ler as regras, skills, prompts mestres e histórico ANTES de iniciar um trabalho pesado. O prompt de ativação fica no topo absoluto (`## 0. Inicialização`) do `PROMPTS_MESTRES.md`.
  - Lê: N/A
  - Altera: `.agents/skills/brain-sync/SKILL.md`, `.agents/rules/global_rules.md`, `PROMPTS_MESTRES.md`

- [x] **M-31** Revisão e Sincronização do Catálogo (Prompt-Skill Sync) — Refatorar o `PROMPTS_MESTRES.md` para que atue como uma documentação clínica das skills. Adicionar explicações detalhadas, condições de uso, e variações (ex: "Use para X, mas pode ser usado para Y e Z") atrelando cada prompt à sua respectiva skill autônoma.
  - Lê: todas as skills em `.agents/skills/`
  - Altera: `PROMPTS_MESTRES.md`


- [x] **M-37** [Security Audit — Fase 1: Planejamento de Correções Cirúrgicas] — Registrar 4 novas T-tasks de segurança no TAREFAS.md com base nos achados SEC-01..SEC-07 da varredura automática: (T-098) sanitizar `LIMIT` em `reviews.js` com bound parameter `$N` em vez de interpolação; (T-099) criar helper centralizado `errorHandler(err, req, res)` que não vaza `err.message` em produção; (T-100) instalar e configurar `helmet` no `index.js`; (T-101) remover o `console.log` de credenciais de infraestrutura do startup. Acionar skill `studyreviewblast-planner` para executar. Arquivos: `server/src/routes/reviews.js`, `server/src/index.js`, `plano-de-acao/TAREFAS.md`.
  - Lê: `server/src/`, `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/TAREFAS.md` (T-098 a T-101 criadas) ✅ CONCLUÍDO
  - Achados que motivaram: SEC-01 (SQL LIMIT interpolado), SEC-02 (err.message leak 35+ locais), SEC-03 (credenciais no log), SEC-04 (ausência de helmet)

- [x] **M-38** [Criação da Skill `security-scanner`] — Skill permanente `.agents/skills/security-scanner/SKILL.md` criada com 7 verificações V-01..V-07. Prompt 10 injetado no `PROMPTS_MESTRES.md`. ✅ CONCLUÍDA.
  - Lê: `.agents/skills/markdown-doctor/SKILL.md` (referência estrutural), `global_rules.md`
  - Altera: `.agents/skills/security-scanner/SKILL.md` (criação) ✅, `PROMPTS_MESTRES.md` (Prompt 10) ✅

- [x] **M-39** [Execução da Auditoria de Segurança — Ativação dos Próximos Passos] — CONCLUÍDA. Passo 1: T-098..T-101 criadas, M-37 fechada. Passo 2: security-scanner rodado, SEC-01..SEC-04 confirmados rastreados via T-098..T-101, SEC-05 (rate-limit) identificado sem T-task (proposta T-102 para M futura), SEC-06 aceito por design, SEC-07 OK.
  - Altera: `plano-de-acao/TAREFAS.md` (T-098..T-101) ✅, `MELHORIA-PLANO.md` (M-37,M-38,M-39 fechadas) ✅
  - Skills: `studyreviewblast-planner` (Passo 1) → `security-scanner` (Passo 2) ✅

- [x] **M-40** [Fechamento da Auditoria de Segurança — Rate Limiting] — Criar cartão T-102 para cobrir a pendência SEC-05 descoberta no passo 2 da M-39. A tarefa T-102 instalará o `express-rate-limit` no Express para as rotas críticas. Sugerir o commit logo em seguida.
  - Lê: `plano-de-acao/TAREFAS.md`
  - Altera: `plano-de-acao/TAREFAS.md` (T-102 adicionada) ✅
  - Skills: `studyreviewblast-planner` ✅

- [x] **M-41** [Repriorização de Segurança - Parte 1: Análise e Rascunho] — Analisar a fila completa do `TAREFAS.md` e `PLANO.md` para extrair itens de segurança e estabilidade (ex: T-098 a T-102) que devem ser antecipados. Gerar um artefato de texto (rascunho) com a nova ordem da fila de prioridade para revisão, *sem alterar* os arquivos originais ainda (Regra de Task Sizing/Split). ✅ CONCLUÍDA
  - Limite: 1 arquivo temporário (artefato).
  - Skill acionada: `gerador-de-m`
  - Artefato gerado: `plano-de-acao/RASCUNHO_PRIORIZACAO_SEGURANCA.md`

- [x] **M-42** [Repriorização de Segurança - Parte 2: Estrutura do PLANO.md] — Refletir a reordenação aprovada na M-41 dentro do arquivo `PLANO.md`, ajustando apenas os nomes, IDs e ordem das fases de alto nível, mantendo o controle de tokens. ✅ CONCLUÍDA
  - Limite: 1 arquivo (`plano-de-acao/PLANO.md`).
  - Skill acionada: `gerador-de-m`

- [x] **M-43** [Repriorização de Segurança - Parte 3: Detalhamento do TAREFAS.md] — Modificar o extenso arquivo `TAREFAS.md`, movendo os blocos completos dos cartões reordenados para o topo de suas respectivas fases, respeitando as dependências técnicas. ✅ CONCLUÍDA
  - Limite: 1 arquivo (`plano-de-acao/TAREFAS.md`).
  - Skill acionada: `gerador-de-m`

- [x] **M-44** [Markdown Doctor Pós-Reorganização] — Como as etapas 42 e 43 vão mover cabeçalhos e alterar IDs, executar uma varredura completa para curar âncoras e referências cruzadas que possam ter quebrado entre `PLANO.md`, `TAREFAS.md` e `RETOMAR.md`. ✅ CONCLUÍDA
  - Limite: Todos os .md da pasta plano-de-acao.
  - Skill acionada: `markdown-doctor`

- [x] **M-45** [Faxina Segura de Arquivos Obsoletos] — Excluir permanentemente o rascunho temporário `RASCUNHO_PRIORIZACAO_SEGURANCA.md` e os 5 arquivos `.log` localizados na raiz do repositório, garantindo que o Workspace fique limpo. ✅ CONCLUÍDA
  - Limite: 6 arquivos a serem deletados.
  - Skill acionada: `safe-cleanup`

- [x] **M-46** [Auditoria e Reorganização das Ms Pendentes] — Avaliar o motivo de M-19 e M-32 a M-36 estarem abertas, verificar dependências lógicas e reorganizar a fila do `MELHORIA-PLANO.md` estabelecendo a nova ordem de prioridade. ✅ CONCLUÍDA
  - Limite: 1 arquivo (`MELHORIA-PLANO.md`)
  - Skill acionada: `project-oracle` / `gerador-de-m`

### Fila Ativa de Melhorias (Reorganizada na M-46)

- [x] **M-47** [Criação da Skill `task-reviewer`] — Criar uma nova skill permanente em `.agents/skills/task-reviewer/SKILL.md` especializada em automatizar a revisão de tarefas M e T, garantindo que o planejamento de cada passo sempre aplique as skills de agentes apropriadas. *(Prioridade Máxima)* ✅ CONCLUÍDA
  - Limite: 1 arquivo novo (a skill).
  - Skill acionada: `gerador-de-m` (criação de skill)

- [ ] **M-48** [Expansão Mestra do Catálogo de Prompts] — Revisar o `PROMPTS_MESTRES.md` para registrar a nova skill (`task-reviewer`) via `prompt-updater`, e reescrever o catálogo adicionando múltiplas variações de prompts práticos para cada tipo de resolução e skill.
  - Limite: 1 arquivo (`PROMPTS_MESTRES.md`)
  - Skill acionada: `prompt-updater`

- [ ] **M-34** Segregação de Agentes (Melhoria vs Ação) — Estruturar a separação lógica e física das skills. Evitar confusão separando as skills de infraestrutura (`plano-de-melhoria`) das skills de código (`plano-de-acao`). Organizar a pasta `.agents/skills/` em subdomínios (ex: `architect/` e `coder/`) e migrar com segurança o conteúdo da pasta `/skills` da raiz para a nova hierarquia, ajustando nomes de arquivos sem bugar o sistema atual.
  - Lê: `/skills/`, `.agents/skills/`
  - Altera: sistema de arquivos (`.agents/skills/`), acionando `markdown-doctor` em seguida.

- [ ] **M-32** Skill "Revisor de Dependências" (Dependency Checker) — Criar a skill `dependency-checker` em `.agents/skills/`. Ela varrerá a fila de melhorias procurando por tarefas não concluídas (`[ ]` ou `[~]`) que contêm tags de bloqueio. Ela validará se a tarefa bloqueadora já foi concluída e informará o usuário exatamente quais tarefas agora estão livres.
  - Lê: `plano-de-melhoria/MELHORIA-PLANO.md`
  - Altera: `.agents/skills/dependency-checker/SKILL.md` (criação)

- [ ] **M-36** Sincronização Final do Catálogo Operacional — Após segregar os agentes e evoluir o modelo do plano de ação, acionar o `prompt-updater` para injetar os novos Prompts Mestres operacionais (para as T-tasks) no catálogo, formalizando os dois sistemas paralelos.
  - Lê: novas skills segregadas
  - Altera: `PROMPTS_MESTRES.md`

- [ ] **M-33** Auditoria de Regras Específicas (Plano de Ação) — Conferir minuciosamente todas as regras que se aplicam SOMENTE ao `plano-de-acao/` (TDD, arquitetura do DB, pausas rígidas). Analisar exceções, avaliar o que pode ser reaproveitado e definir como o arquivo mestre deverá trabalhar para abrigar essas especificidades sem conflitar com as regras de melhoria arquitetural.
  - Lê: `plano-de-acao/RETOMAR.md`, `plano-de-acao/PLANO.md`
  - Altera: `MELHORIA-PLANO.md` (Mapeamento de Regras)

- [ ] **M-35** Evolução do `RETOMAR.md` (Mimetizando o Master Prompt) — O `RETOMAR.md` é o embrião do prompt mestre para código. A tarefa é aplicar a mesma lógica das skills de contexto a ele. Transformar seu fluxo em um sistema parelho ao de "prompts/skills", garantindo que a execução operacional siga a mesma fluidez das tarefas "M".
  - Lê: `plano-de-acao/RETOMAR.md`
  - Altera: `RETOMAR.md`, `.agents/skills/studyreviewblast-planner/SKILL.md`

- [ ] **M-19** Reestruturação e Renomeação — Propor a tradução e reestruturação dos nomes de arquivos de documentação para o inglês (separado em sub-tarefas a, b, c). **[ADIADA por complexidade]**
  - Lê: estrutura atual
  - Altera: `plano-de-melhoria/MELHORIA-PLANO.md` (para documentar o plano de renomeação)

---

## Checklist de requisitos (para a M-03)

| Código | Requisito |
|---|---|
| R-01 | Reaproveita o plano V1 e preserva o histórico em `legado/` |
| R-02 | Tarefas pequenas (P ou M), uma por sessão |
| R-03 | Todo T inclui o front (ou justificativa) |
| R-04 | Teste escrito antes e visto falhando |
| R-05 | Pausa em todo T com `git add .` na raiz, sem push, commit em inglês convencional |
| R-06 | Nada pago no plano (ideias pagas só em "Melhorias pós-prova de fogo" no README) |
| R-07 | ORM + qualidade (lint, hooks, CI, Zod, segurança, logs) e proteção contra SQL injection |
| R-08 | Tradução total para inglês planejada e não executada, com i18n |
| R-09 | Estudo estilo Anki + repetição espaçada + dashboard + voz gratuita |
| R-10 | README da raiz como guia mestre (onde parei, algoritmo do dia, prompt por T, decisões em linguagem simples, melhorias pós-T-090) |
| R-11 | `RETOMAR.md` é o ponto de entrada diário e funciona ao trocar de modelo de IA |
| R-12 | READMEs sem função de `client/` e `server/` removidos |
| R-13 | Prova de fogo final |
| R-14 | Dependências só da lista aprovada, e essa lista cobre TODAS as fases |
| R-15 | Portas, proxy e scripts dev intactos, salvo D-07 e D-09 |
| R-16 | Nenhum segredo nos documentos |

---

## LOG (append-only — nunca apagar linhas)

```
[2026-10-05 19:59] INÍCIO M-14 — Correções no legado e lacunas L-xx
[2026-10-05 20:02] FIM M-14 — arquivos alterados: legado/MAPA-V1-V2.md, legado/RELATORIO-RECONSTRUCAO-V2.md — achados: corrigida a ambiguidade da T-001 V1 e inserida nota explícita de rastreabilidade indireta para L-03 e L-04 no relatório de reconstrução. As faixas da tabela 100% novas já constavam como listas exatas.
[2026-10-05 20:07] INÍCIO M-15 — Verificação final
[2026-10-05 20:07] FIM M-15 — arquivos alterados: plano-de-melhoria/MELHORIA-PLANO.md — achados: plan_tool.py status reporta corretamente 4/97 e próxima tarefa como T-002; links revisados; todas as pendências resolvidas. O planejamento do Plano V2 está oficialmente pronto e validado.
[2026-10-05 19:57] INÍCIO M-13 — Alinhamento do README.md da raiz
[2026-10-05 19:58] FIM M-13 — arquivos alterados: README.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: README atualizado com observação sobre tradução opcional na Fase 15; referências à pasta plano-de-melhoria/ removidas da tabela de Reports e do Directory Structure conforme decisão de governança da M-07 (não citar plano de melhoria em documentos públicos).
[2026-10-03 21:09] INÍCIO M-00 (criação do plano de melhoria)
[2026-10-03 21:09] FIM M-00 — Arquivos criados: skills/SKILL-MELHORIA-PLANO.md, plano-de-acao/MELHORIA-PLANO.md
                   Passo 1 (reconhecimento leve):
                   - Branch atual: v2/phase-01-safety-net
                   - plan_tool.py status: 4/94 (4%) — PRÓXIMA: T-002
                   - git status: working tree clean (sem arquivos modificados não commitados)
                   - Estrutura: plano-de-acao/ (7 arquivos + legado/ com 6), skills/ (2 md + 3 subpastas), raiz (README.md, .env, .gitignore, migrate_session_type.js)
                   - Achados preliminares (sem M formal): links absolutos em RELATORIO-GERAL §4 e §6; RELATORIO-GERAL §5B menciona "análise fonética" via Web Speech API (possível conflito com princípio 100% local); D-10 não lista ts-fsrs, Playwright, libs OpenAPI/cobertura; D-11 a D-18 pendentes; 8 documentos de planejamento sem hierarquia clara definida; migrations/README.md existe.
[2026-10-03 21:16] INÍCIO M-01 — Inventário de arquivos .md e .py
[2026-10-03 21:18] FIM M-01 — arquivos alterados: plano-de-acao/MELHORIA-PLANO.md
                   Achados: F-01 (inventário completo classificado), F-02 (plan_tool.py duplicado), F-03 (órfão migrate_session_type.js), F-04 (migrations/README.md mínimo), F-05 (PROMPT_ORIGINAL.md sem hierarquia), F-06 (diagnostico-atual.md sem classificação), F-07 (plano-de-melhoria/ fora do escopo)
                   Perguntas geradas: Q-01, Q-02, Q-03, Q-04
[2026-10-03 21:22] INÍCIO M-02 — Verdade no disco
[2026-10-03 21:26] FIM M-02 — arquivos alterados: plano-de-acao/MELHORIA-PLANO.md
                   Achados: F-08 (status 4/94 ✅), F-09 (94 cartões T-001–T-094 ✅; campo Objetivo ausente em T-028+), F-10 (campo Pausa não existe como campo separado), F-11 (plan_tool init aponta para arquivo inexistente), F-12 (§2 RELATORIO-GERAL vs disco ✅ exceto PLANO.inicial.md), F-13 (§3 estado atual ✅)
                   Perguntas geradas: Q-05
[2026-10-03 21:28] INÍCIO M-03 — Conformidade R-01..R-16
[2026-10-03 21:49] FIM M-03 — arquivos alterados: plano-de-acao/MELHORIA-PLANO.md
                   Achados: F-14 (checklist R-01..R-16: 14 ✅, 2 ⚠️, 0 ❌)
                   R-14 ⚠️: ts-fsrs em D-10 (aprovada) mas D-14 diz "Proposto"; incoerência a resolver na M-08
                   R-16 ⚠️: menções instrucionais de senha; nenhum segredo real exposto
[2026-10-03 21:50] INÍCIO M-04 — Auditoria do legado V1
[2026-10-03 21:59] FIM M-04 — arquivos alterados: plano-de-acao/MELHORIA-PLANO.md
                   Lacunas: L-01..L-05 (L-01/L-02 cosméticas; L-03/L-04 rastreabilidade indireta aceitável)
                   Todas as T V1 com destino no MAPA e evidência no disco ✅; correções do MAPA ficam para M-14
[2026-10-03 22:00] INÍCIO M-05 — Auditoria de código (somente leitura)
[2026-10-03 22:02] FIM M-05 — arquivos alterados: plano-de-acao/MELHORIA-PLANO.md
                   Achados: F-15..F-21 (LIMIT interpolado, err.message vazando, sem validação, testes sem T, pgcrypto ocioso, console.log)
                   Nenhum código alterado
[2026-10-03 22:05] INÍCIO M-06 — Consolidar pendências
                   D-11 = Docker (decisão do usuário). 15 itens consolidados; PAUSA aguardando resposta
[2026-10-03 22:33] FIM M-06 — arquivos alterados: plano-de-acao/MELHORIA-PLANO.md, plano-de-melhoria/CENTRAL_IDEA.md (só o Prompt B)
                   Resposta do usuário registrada (itens 1–16). Docker 29.5.2 / Compose v5.1.3 confirmados (fora do PATH da IDE)
                   Item 16: mover MELHORIA-PLANO.md para plano-de-melhoria/ = 1º passo da M-07; auditoria pacote×cartão = 1º passo da M-08
                   NOTA: todas as entradas até aqui citam o caminho antigo plano-de-acao/MELHORIA-PLANO.md
[2026-10-04 00:02] REPARO (fora do ciclo de M) — MELHORIA-PLANO.md e SKILL-MELHORIA-PLANO.md movidos manualmente para plano-de-melhoria/; referênças ativas corrigidas (plano-de-melhoria/SKILL-MELHORIA-PLANO.md, plano-de-melhoria/CENTRAL_IDEA.md, plano-de-melhoria/MELHORIA-PLANO.md); escopo da skill inclui plano-de-melhoria/; bloco do Prompt B removido do README.md. Entradas anteriores do LOG citam os caminhos antigos (histórico, não alteradas).
[2026-10-04 00:43] REPARO — Prompt A em CENTRAL_IDEA.md corrigido para gerar e referenciar arquivos em plano-de-melhoria/; inventário F-01 e referências das tarefas M-01 a M-15 em MELHORIA-PLANO.md atualizados para plano-de-melhoria/.
[2026-10-04 00:55] INÍCIO M-07 — Hierarquia de documentos
[2026-10-04 00:57] FIM M-07 — arquivos alterados: plano-de-melhoria/MELHORIA-PLANO.md — achados: leitura completa e minuciosa de todos os .md de plano-de-acao/ (RELATORIO-GERAL, PLANO, TAREFAS, RETOMAR, LINHA-DO-TEMPO, PROMPT_ORIGINAL, legado/*), skills/ (SKILLENG, skill, assets/*, references/*) e plano-de-melhoria/ (MELHORIA-PLANO, SKILL-MELHORIA-PLANO, CENTRAL_IDEA); governança estruturada em 2 regimes (Meta-Regulação Ativa Fase M via plano-de-melhoria/ e Execução Operacional Fase T com RELATORIO-GERAL > RETOMAR > PLANO > TAREFAS > LINHA-DO-TEMPO > skills > README); ordem única canônica de 6 passos para sessões T formalizada; plano-de-acao/plan_tool.py declarado ferramenta operacional única; plano-de-melhoria/ integrada formalmente na matriz de autoridade com arquivamento futuro em legado/ previsto; legado/ ratificado como estritamente somente leitura; inventário de 5 links absolutos file:/// e 2 caminhos locais levantados para substituição em M-09, M-11 e M-12.
[2026-10-04 01:30] INÍCIO M-08 — Atualização do PLANO.md e auditoria de pacotes
[2026-10-04 01:34] FIM M-08 — arquivos alterados: plano-de-acao/PLANO.md, plano-de-melhoria/MELHORIA-PLANO.md, plano-de-acao/LINHA-DO-TEMPO.md — achados: auditoria pacote × cartão concluída (dependências 100% mapeadas); D-11 a D-18 migradas de Proposto/Aguardando para Decidido; D-10 estendida com pacotes TypeScript de teste (typescript-eslint, ts-jest, types); tarefas T-095 (sanitização de LIMIT/OFFSET e err.message), T-096 (testes srs/tts client) e T-097 (teste status server) adicionadas com sucesso via add-feature sob autorização explícita; M-09 dividida em 4 etapas (M-09a..M-09d) para prevenção de saturação de contexto.
[2026-10-04 01:52] INÍCIO M-09a — Cartões T-095..T-097 e revisão Fases 1 a 4 em TAREFAS.md
[2026-10-04 01:55] FIM M-09a — arquivos alterados: plano-de-acao/TAREFAS.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: cartões T-095, T-096 e T-097 criados e documentados completos; Fases 1 a 4 (T-001 a T-024) padronizadas com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3; caminho de backup de máquina em T-002 generalizado.
[2026-10-04 16:18] INÍCIO M-09b — Padronização de TAREFAS.md (Fases 5 a 8: T-025 a T-053)
[2026-10-04 16:21] FIM M-09b — arquivos alterados: plano-de-acao/TAREFAS.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: 28 cartões ativos das Fases 5 a 8 (T-025 a T-053) revisados e padronizados com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3; stub legado T-050 preservado intacto.
[2026-10-04 16:25] INÍCIO M-09c — Padronização de TAREFAS.md (Fases 9 a 11: T-054 a T-081)
[2026-10-04 16:27] FIM M-09c — arquivos alterados: plano-de-acao/TAREFAS.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: 28 cartões ativos das Fases 9 a 11 (T-054 a T-081) padronizados com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3.
[2026-10-04 16:27] INÍCIO M-09d — Padronização de TAREFAS.md (Fases 12 a 15: T-082 a T-094)
[2026-10-04 16:29] FIM M-09d — arquivos alterados: plano-de-acao/TAREFAS.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: 13 cartões das Fases 12 a 15 (T-082 a T-094) padronizados com campo Objetivo explícito e apontamento canônico de pausa para RETOMAR.md §3; 100% dos 94 cartões ativos de TAREFAS.md agora possuem Objetivo e Pausa canônica padronizados.
[2026-10-04 16:31] INÍCIO M-10 — Alinhamento de RETOMAR.md à hierarquia da M-07
[2026-10-04 16:34] FIM M-10 — arquivos alterados: plano-de-acao/RETOMAR.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: RETOMAR.md alinhado com a governança da M-07 (ordem canônica de leitura de 6 passos, matriz de precedência de 10 níveis, plan_tool.py operacional único com init obsoleto, confinamento de plano-de-melhoria/ e ambiente atualizado com Docker Desktop).
[2026-10-04 16:36] INÍCIO M-11 — Ajustes no RELATORIO-GERAL-PROJETO.md
[2026-10-04 17:16] FIM M-11 — arquivos alterados: plano-de-acao/RELATORIO-GERAL-PROJETO.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: 5 links absolutos file:/// substituídos por caminhos relativos; §5B e D-18 ajustados para voz e comparação falado/esperado com privacidade (100% local por padrão); Fase 6 e visão de futuro alinhadas com adoção incremental de TypeScript (D-07); tabela D-11..D-18 atualizada para Decidido; §6.1 alinhado à ordem canônica de 6 passos da M-07.
[2026-10-04 17:36] INÍCIO M-12 — Alinhamento das skills à governança e decisões
[2026-10-04 17:40] FIM M-12 — arquivos alterados: skills/SKILLENG.md, skills/references/convencoes-v2.md, skills/skill.md, skills/references/diagnostico-atual.md, plano-de-melhoria/MELHORIA-PLANO.md — achados: SKILLENG.md alinhado com a governança da M-07 (6 passos canônicos, plan_tool.py operacional único com init obsoleto, T-092 prova de fogo e stack D-11/D-14/D-18); convencoes-v2.md com pasta de backup generalizada e D-16 ratificado sem renomear plano-de-acao/; skill.md alinhado com D-08 (README em pt-BR até Fase 14); diagnostico-atual.md com tarja de histórico e somente leitura.
[2026-10-05 23:45] INÍCIO M-16 — Criação da Skill "Gerador de M" e Arquivo Mestre
[2026-10-05 23:45] FIM M-16 — arquivos alterados: .agents/skills/gerador-de-m/SKILL.md, plano-de-melhoria/PROMPTS_MESTRES.md — achados: Criada a skill `gerador-de-m` e o arquivo `PROMPTS_MESTRES.md`. O novo catálogo de prompts foi centralizado e as intenções agora passam obrigatoriamente pela geração de uma tarefa M antes de serem executadas, garantindo segurança contra perda de contexto.
[2026-10-05 23:46] INÍCIO M-25 — Refatoração Visual do PROMPTS_MESTRES.md
[2026-10-05 23:46] FIM M-25 — arquivos alterados: plano-de-melhoria/PROMPTS_MESTRES.md — achados: O arquivo de prompts mestres foi reescrito. Agora cada intenção possui um título enumerado e um bloco de código markdown isolado, permitindo que o usuário copie a instrução completa com apenas um clique, melhorando a intuição e usabilidade.
[2026-10-05 23:55] INÍCIO M-17 — Consolidação das Regras Mestras Globais
[2026-10-05 23:55] FIM M-17 — arquivos alterados: .agents/rules/global_rules.md — achados: Criado o arquivo de regras globais em formato nativo (.agents/rules). A partir de agora, as diretrizes inegociáveis de "Pausar após cada tarefa", "Prevenção de conflitos D-xx/M-xx", e "Segurança do Gerador M" estão ativas permanentemente no contexto do Antigravity, eliminando a necessidade de repeti-las em cada prompt manual.
[2026-10-06 00:02] INÍCIO M-16b — Refinamento de Segurança e Triagem de Regras
[2026-10-06 00:03] FIM M-16b — arquivos alterados: .agents/rules/global_rules.md — achados: O arquivo de regras globais foi enriquecido. Foram adicionadas travas de segurança rígidas contra alucinação, proibição absoluta de exposição do arquivo `.env` e chaves sensíveis, proibição de commit com senhas, além da regra anti-bagunça para que qualquer limpeza passe antes por planejamento M. Regras obsoletas que conflitavam com as decisões D-xx atuais (ex: ausência de ORM) foram expurgadas do comportamento global.
[2026-10-06 00:07] INÍCIO M-18 — Padronização 100% Inglês
[2026-10-06 00:07] FIM M-18 — arquivos alterados: plano-de-acao/PLANO.md, .agents/skills/studyreviewblast-planner/SKILL.md — achados: Inserida a Decisão D-19 formalizando o inglês técnico no projeto. A skill do planner também foi atualizada com a regra inegociável #7, garantindo que o código, os commits e as pastas criadas por ele não usem português.
[2026-10-06 00:14] INÍCIO M-20 — Regra de Backup no Legado
[2026-10-06 00:15] FIM M-20 — arquivos alterados: plano-de-acao/RELATORIO-GERAL-PROJETO.md — achados: Adicionada a trava "Backup Obrigatório" nas restrições técnicas, proibindo renomeação ou exclusão estrutural sem clone em legado.
[2026-10-06 00:15] INÍCIO M-21 — Criação da Skill Limpador Seguro (Cleanup)
[2026-10-06 00:15] FIM M-21 — arquivos alterados: .agents/skills/safe-cleanup/SKILL.md — achados: Criada a skill `safe-cleanup`. Qualquer faxina agora exige justificativa formal de obsolescência e prompt explícito de autorização para ir para a lixeira ou para o legado.
[2026-10-06 00:22] INÍCIO M-26 — Skills Markdown Doctor / Prompt Updater e Regra
[2026-10-06 00:25] FIM M-26 — arquivos alterados: global_rules.md, PROMPTS_MESTRES.md, novas skills — achados: Criadas as skills `markdown-doctor` (saneamento de links da documentação) e `prompt-updater` (manutenção do catálogo). Adicionada a regra global exigindo a atualização síncrona do PROMPTS_MESTRES via prompt-updater sempre que algo novo for gerado.
[2026-10-06 00:30] INÍCIO M-27 — Atualização do README
[2026-10-06 00:30] FIM M-27 — arquivos alterados: README.md — achados: Acionada a skill `readme-open-source`. Inserida a Decisão D-19 (English Standard) na tabela oficial e criada a nova seção "Autonomous AI Agents & Custom Skills" documentando todo o ecossistema e ferramentas sob `.agents/skills/` para exibir o repositório como um projeto open source profissional governado por agentes de IA.
[2026-10-06 00:38] INÍCIO M-28 — Skill Project Oracle (Buscador de Contexto)
[2026-10-06 00:39] FIM M-28 — arquivos alterados: project-oracle/SKILL.md, global_rules.md, PROMPTS_MESTRES.md, RELATORIO-GERAL-PROJETO.md — achados: Criada a skill `project-oracle`. A regra 7 de "Oráculo Obrigatório" foi implementada, impedindo a IA de chutar o que foi feito sem ler os logs antes. O RELATORIO-GERAL-PROJETO foi atualizado e sincronizado com todas as novas dinâmicas, refletindo a estrutura completa de inteligência do repositório.
[2026-10-06 00:50] INÍCIO M-29 e M-30 — Skills Crash Recovery, Hierarchy Sync e Brain Sync
[2026-10-06 00:58] FIM M-29 e M-30 — arquivos alterados: skills criadas, global_rules.md, PROMPTS_MESTRES.md — achados: Execução simultânea por comando direto do usuário. A arquitetura de resiliência e contexto profundo foi finalizada. As skills `crash-recovery` e `hierarchy-sync` garantem integridade em caso de quedas de energia/token e evolução da documentação. A skill `brain-sync` atua como o boot cognitivo da IA, forçando-a a cruzar regras, skills e prompts antes de agir, tornando o agente proativo e altamente alinhado ao contexto. O prompt 0 foi adicionado no topo do catálogo mestre.
[2026-10-06 01:07] INÍCIO M-22 e M-23 — Faxina Segura e Markdown Doctor
[2026-10-06 01:10] FIM M-22 e M-23 — arquivos alterados: markdown-doctor/SKILL.md, README.md, RELATORIO-GERAL-PROJETO.md, RETOMAR.md — achados: Os 4 arquivos obsoletos da estrutura V1 (PROMPT_ORIGINAL.md, CENTRAL_IDEA.md, CONVERSABUGSMELHORIA.md, SKILL-MELHORIA-PLANO.md) foram movidos para plano-de-acao/legado/. O Markdown Doctor teve sua inteligência aprimorada com o "Ciclo de Observação" (look-ahead de dependências) e foi rodado para curar e atualizar as referências órfãs nos documentos ativos.
[2026-10-06 01:15] INÍCIO M-24 — Aprimoramento da Detecção de Skills (Gerador de M)
[2026-10-06 01:16] FIM M-24 — arquivos alterados: gerador-de-m/SKILL.md — achados: Injetado o "Filtro de Autoconsciência" na skill gerador-de-m. Agora ela vasculha a biblioteca de agentes antes de planejar. Se a skill existe, ela reaproveita; se é demanda repetitiva/arquitetural, ela arquiteta uma skill nova; se é pontual, ela faz planejamento normal. Isso fecha 100% da fila original de melhorias arquiteturais.
[2026-10-06 01:19] INÍCIO M-31 — Sincronização do Catálogo (Prompt-Skill Sync)
[2026-10-06 01:21] FIM M-31 — arquivos alterados: PROMPTS_MESTRES.md — achados: O catálogo foi totalmente reescrito. Deixou de ser apenas uma lista de textos para copiar/colar e se tornou um manual rico detalhando qual skill é acionada, como funciona, e variações de uso (ex: "Execute para X, mas pode usar para Y e Z"). Isso estabelece uma sincronia clínica 1:1 entre as skills reais da pasta .agents e a vitrine de operação do usuário.
[2026-10-06 13:30] PRÉ-REGISTRO M-37 e M-38 — Varredura de segurança executada sobre server/src/. Achados SEC-01..SEC-07 documentados. M-37 planejar T-098..T-101 (LIMIT interpolado, err.message leak, helmet ausente, log de credenciais). M-38 criar skill security-scanner + registrar Prompt 10 no PROMPTS_MESTRES. Autorização do usuário concedida.
[2026-10-06 13:30] INÍCIO M-37 + M-38 — Execução: (1) adicionar cartões M-37 e M-38 ao MELHORIA-PLANO.md; (2) criar .agents/skills/security-scanner/SKILL.md; (3) injetar Prompt 10 em PROMPTS_MESTRES.md via lógica prompt-updater.
[2026-10-06 13:33] FIM M-37 e M-38 — arquivos alterados: plano-de-melhoria/MELHORIA-PLANO.md (cartões M-37 e M-38 adicionados), .agents/skills/security-scanner/SKILL.md (criada), plano-de-melhoria/PROMPTS_MESTRES.md (Prompt 10 injetado) — achados: SEC-01 (LIMIT interpolado em reviews.js:320), SEC-02 (err.message leak em 35+ locais), SEC-03 (credenciais em console.log no startup), SEC-04 (helmet ausente), SEC-05 (rate-limit ausente), SEC-06 (DELETE /api/students sem auth), SEC-07 (.env no gitignore ✅ OK). Skill security-scanner criada com 7 verificações V-01..V-07 e formato de achado SEC-xx. Prompt 10 registrado no catálogo mestre.
[2026-10-06 13:40] PRÉ-REGISTRO M-39 — Orquestração da execução dos próximos passos da auditoria. Passo 1: criar T-098..T-101 em TAREFAS.md e fechar M-37. Passo 2 (após autorização): rodar security-scanner de confirmação. Regra de commit explícita entre os dois passos.
[2026-10-06 13:40] INÍCIO M-39 — Passo 1: adicionando cartões T-098..T-101 em plano-de-acao/TAREFAS.md.
[2026-10-06 13:42] FIM M-39 PASSO 1 — arquivo alterado: plano-de-acao/TAREFAS.md (T-098..T-101 adicionadas), MELHORIA-PLANO.md (M-37 fechado como [x]). PAUSADO. Aguardando autorização para Passo 2 (security-scanner de confirmação).
[2026-10-06 13:57] SAVE-STATE (crash-recovery) M-39 PASSO 2 — Sistema sobrecarregado antes de iniciar o Passo 2. Estado no momento do crash: Passo 1 100% concluído e persistido no disco. Arquivos modificados nesta sessão: plano-de-acao/TAREFAS.md (+T-098..T-101), plano-de-melhoria/MELHORIA-PLANO.md (M-37=[x], M-38=[~], M-39=[~], LOG atualizado), .agents/skills/security-scanner/SKILL.md (criada), plano-de-melhoria/PROMPTS_MESTRES.md (Prompt 10 injetado). PRÓXIMO PASSO: Passo 2 da M-39 — rodar security-scanner V-01..V-07 como varredura de confirmação sobre server/src/. Verificar SEC-01..SEC-04 rastreados via T-098..T-101. Checar SEC-05 (rate-limit) e SEC-06 (DELETE sem auth) ainda abertos. Fechar M-38 e M-39 como [x] ao concluir. Commit sugerido: "audit(sec): run security-scanner confirmation, close M-38 M-39".
[2026-10-06 14:06] RETOMADA M-39 PASSO 2 — Autorização confirmada pelo usuário. Iniciando varredura de confirmação security-scanner V-01..V-07.
[2026-10-06 14:08] FIM M-39 PASSO 2 e FIM M-39 COMPLETA — Varredura security-scanner V-01..V-07 executada. Resultado: SEC-01 rastreado (T-098), SEC-02 rastreado (T-099), SEC-03 rastreado (T-101), SEC-04 rastreado (T-100), SEC-05 sem T-task ainda (proposta T-102 para M futura), SEC-06 aceito por design (DELETE students sem auth, documentado), SEC-07 OK (.env no .gitignore). M-37=[x], M-38=[x], M-39=[x]. Arquivos alterados: MELHORIA-PLANO.md (fechamento das 3 Ms + save-state + FIM). Não houve alteração de código-fonte nesta M.
[2026-10-06 14:11] SAVE-STATE SESSÃO ENCERRADA — Pendência aberta ao encerrar: SEC-05 (express-rate-limit ausente no servidor Express) identificado na varredura V-05 mas sem cartão T-task correspondente. PRÓXIMA AÇÃO: criar M-40 via gerador-de-m para gerar T-102 (instalar express-rate-limit nas rotas críticas: POST /api/students, POST /api/reviews, GET /api/reviews/queue). Nenhum código foi alterado nesta sessão — todas as ações foram de planejamento (criação de Ms, cartões T e skills). Commit pendente: "audit(sec): complete M-39 security audit cycle". Arquivos modificados não commitados: plano-de-melhoria/MELHORIA-PLANO.md. Para retomar: usar Prompt 8 (crash-recovery) seguido de Prompt 2 (gerador-de-m para M-40).
[2026-10-06 14:48] FIM M-40 — arquivo alterado: plano-de-acao/TAREFAS.md (T-102 adicionada). Pendência SEC-05 agora rastreada por uma T-task. Além disso, as regras da skill gerador-de-m e o Catálogo de Prompts foram atualizados com inteligência de 'Task Sizing' (limite e split de tokens).
[2026-10-06 15:15] PRÉ-REGISTRO GERADOR DE M — Planejamento de Reorganização de Prioridades (Security First). Regra de 'Task Sizing' e 'Split' aplicada: devido ao risco de limite de tokens ao editar arquivos imensos como PLANO.md e TAREFAS.md simultaneamente, a intenção foi "splitada" em 4 cartões (M-41 a M-44). O planejamento previu o uso da skill 'markdown-doctor' (M-44) para reparar referências após a movimentação estrutural.
[2026-10-06 15:19] FIM M-41 — Rascunho de priorização gerado. Arquivo `plano-de-acao/RASCUNHO_PRIORIZACAO_SEGURANCA.md` criado demonstrando a intenção de agrupar as tarefas de segurança (T-095, T-098 a T-102) em uma nova 'Fase 1.5' que será inserida antes da Fase 2. Arquivos de plano oficiais não foram alterados para respeitar o limite de tokens.
[2026-10-06 15:28] FIM M-42 — Arquivo `plano-de-acao/PLANO.md` alterado. A "Fase 1.5 — Hotfixes de Segurança" foi fisicamente injetada antes da Fase 2, e os IDs das tarefas T-095, T-098 a T-102 foram movidos para lá. A estrutura de alto nível do plano agora prioriza a segurança. Próximo passo: mover os cartões completos no TAREFAS.md (M-43).
[2026-10-06 15:35] FIM M-43 — Arquivo `plano-de-acao/TAREFAS.md` modificado com sucesso. Os grandes blocos das tarefas T-095, T-098, T-099, T-100, T-101 e T-102 foram extraídos do fundo do arquivo e reinjetados sob o novo cabeçalho da Fase 1.5, imediatamente antes da Fase 2. Todo o conteúdo original das tarefas foi preservado. Próximo passo sugerido: M-44 (markdown-doctor) para curar possíveis links quebrados.
[2026-10-06 15:40] FIM M-44 — Varredura markdown-doctor concluída. Os arquivos e âncoras foram verificados. O bloco 'PRÓXIMO PASSO' no `PLANO.md`, que havia ficado defasado apontando para a T-005, foi devidamente atualizado para apontar para o novo início da fila: T-095. A fundação de planejamento e prioridade foi 100% finalizada (Split M-41 a M-44 encerrado). Próximo passo: Iniciar codificação.
[2026-10-06 16:20] PRÉ-REGISTRO M-45 — Planejamento de faxina segura dos arquivos obsoletos (RASCUNHO_PRIORIZACAO_SEGURANCA.md e logs da raiz). Destino escolhido pelo usuário: exclusão permanente. O M-45 irá deletar esses 6 arquivos via skill safe-cleanup.
[2026-10-06 16:21] FIM M-45 — Faxina segura concluída. Os 6 arquivos obsoletos foram excluídos permanentemente do disco e o repositório agora está limpo de logs temporários. Próximo passo: Iniciar codificação T-098.
[2026-10-06 16:35] PRÉ-REGISTRO GERADOR DE M — Planejamento de Revisão de Ms, Nova Skill de Planejamento e Expansão do Catálogo. Devido à complexidade do pedido do usuário, a intenção foi dividida (Split) em 3 cartões (M-46, M-47, M-48) para respeitar o limite de tokens. M-46 fará a auditoria das Ms abertas (M-19, M-32 a M-36) e reorganizará a fila; M-47 criará a skill de revisão de tarefas (`task-reviewer`); M-48 usará o `prompt-updater` para expandir o `PROMPTS_MESTRES.md` com múltiplas variações para todas as skills.
[2026-10-06 16:36] FIM M-46 — Auditoria concluída. As tarefas M-19, M-32 a M-36 estavam pendentes por causa do hijack da Fase 1.5 de Segurança (M-37 a M-45). Elas foram reorganizadas fisicamente para o fim da fila de melhorias ativas, criando um bloco estruturado. A M-47 (Criar `task-reviewer`) foi colocada como prioridade máxima, seguida da M-48 (Expansão de Prompts) e do restante, sendo o M-19 (Adiada) a última. O planejamento está alinhado e íntegro.
[2026-10-06 16:37] PRÉ-REGISTRO M-47 — Criação da skill `task-reviewer` em `.agents/skills/task-reviewer/SKILL.md` para revisão automatizada de escopos M e T.
[2026-10-06 16:38] FIM M-47 — Skill permanente criada com sucesso. Agora toda tarefa operacional ou de planejamento passará pela barreira de injeção de agentes. Próximo passo: M-48 (Expansão Mestra do Catálogo).
```


