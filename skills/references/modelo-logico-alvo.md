# Modelo lógico alvo (PostgreSQL 18)

Sumário: 1 Princípios · 2 Posse e chaves compostas · 3 Testes de isolamento · 4 Identificação sem login · 5 Migrações · 6 Novas estruturas · 7 Notas de PostgreSQL 18 · 8 Gerador de frases · 9 Backup e restauração

## 1. Princípios
- O banco é a última barreira: o que puder ser garantido por chave, `UNIQUE` ou `CHECK` não deve depender só do código.
- Um dado, um dono. Cada linha que pertence a um estudante tem `student_id` e nenhuma tabela filha pode apontar para dado de outro estudante.
- Mudança de schema só por migração numerada, em transação, testada em banco vazio e em cópia do banco real.
- Não trocar nada da stack. Tudo aqui usa só PostgreSQL 18, `pg` e Node.

## 2. Posse e chaves compostas (decisão D-01)
Modelo recomendado: **a palavra pertence a um estudante**. Motivos: o usuário quer que cada um veja e edite só o que é seu; significados e contextos editados por um não podem alterar o de outro. O custo é perder o catálogo compartilhado; isso se resolve depois com "pacote inicial" (copiar palavras para o estudante), alinhado ao item de roadmap de importar/exportar baralhos.

Alternativa (catálogo global + vínculo): evita duplicar palavras, mas edições vazam entre estudantes. Só adotar se o usuário preferir.

Como garantir no banco:
1. `vocabulary_items.student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE`.
2. `UNIQUE (student_id, word, type)` (substitui `UNIQUE (word, type)`) e `UNIQUE (id, student_id)` (alvo das chaves compostas).
3. Em toda tabela que tem `student_id` e `vocabulary_item_id` (student_vocabulary, tense_practice, reviews, errors, pronunciation_practice, student_sentences, sentences): `FOREIGN KEY (vocabulary_item_id, student_id) REFERENCES vocabulary_items (id, student_id)`. Assim é impossível gravar progresso de A sobre palavra de B.
4. `contexts` ganha `student_id` com `FOREIGN KEY (vocabulary_item_id, student_id) REFERENCES vocabulary_items (id, student_id)` e `UNIQUE (id, student_id)`; `context_mastery` e `reviews.context_practiced` usam chave composta para `contexts`.
5. `meanings` e `verb_forms` herdam o dono pela palavra. No código, só acessar via consulta que une com `vocabulary_items` filtrando `student_id` (criar uma função única, ex.: `getOwnedVocabulary(studentId, id)`).
6. `sentences.student_id` passa a `NOT NULL`.
7. Colunas existentes não perdem dado: adicionar `student_id` como NULL, preencher, depois `SET NOT NULL`.

Migração de dados (D-02, padrão "preservar"): para cada par (estudante, palavra) em `student_vocabulary`, criar uma cópia da palavra com seus significados, contextos e formas verbais, guardar o mapa `id_antigo → id_novo` em tabela temporária, atualizar as tabelas de progresso e histórico com o mapa, e só então remover as palavras originais sem dono. Tudo em uma transação, com contagem de linhas antes e depois. Se o usuário disser que os dados são de teste, basta recriar o banco e rodar `migrate` e `seed`.

## 3. Testes de isolamento (escrever antes da correção)
Com dois estudantes A e B, cada um com uma palavra:
- `GET /api/vocabulary` de B não contém a palavra de A.
- `GET/PATCH/DELETE /api/vocabulary/:id` de B sobre palavra de A responde **404** (não 403, para não revelar que existe).
- `GET /api/reviews/queue` de B só traz palavras de B.
- `POST /api/reviews` de B com `vocabulary_item_id` de A é rejeitado.
- `GET /api/dashboard` de B conta apenas dados de B (vocabulário, frases, pendentes, erros).
- `GET/POST /api/sentences` de B não lista nem anexa frases de A; `student_id` enviado no corpo é ignorado.
- Criar o estudante C novo: começa com zero palavras.
- Excluir A remove só os dados de A.
- Requisição sem `X-Student-Id` ou com id inexistente responde 400/404 com JSON claro.
- Teste no nível do banco: inserir progresso de B apontando para palavra de A falha por violação de chave composta.

## 4. Identificação do estudante sem login (decisão D-04)
- O cliente guarda o estudante ativo no contexto React (já existe) e envia `X-Student-Id` em toda requisição.
- Middleware `requireStudent` valida que o id existe e define `req.studentId`. Nenhuma rota usa `student_id` vindo de corpo ou query para decidir permissão.
- Honestidade: isso **separa** os dados de cada pessoa, mas não os **protege**: quem abrir o app pode escolher outro estudante. É adequado para uso local/offline. Se o app for publicado na internet, login passa a ser obrigatório; o middleware é o ponto único onde ele entraria.
- Opcional e avançado (não fazer sem pedir): Row Level Security no PostgreSQL com `SET LOCAL app.student_id` dentro de transação por requisição.

## 5. Migrações
- Pasta `server/src/db/migrations/`, arquivos `NNN_descricao.sql`, tabela `schema_migrations(version, name, applied_at)`.
- Executor em Node puro com `pg`: lê a pasta, ordena, aplica cada arquivo dentro de `BEGIN/COMMIT`, registra. DDL do PostgreSQL é transacional: erro desfaz o arquivo inteiro.
- `npm run migrate` continua sendo o comando; `schema.sql` vira a base `001_baseline.sql`.
- Nunca editar migração já aplicada; criar a próxima.

## 6. Novas estruturas (esboço; ajustar ao código real)
- `tenses (code PK, language_code, label, sort_order)`: chave estrangeira em `sentences.tense`, `tense_practice.tense`, `reviews.tense_practiced`, `errors.tense`. Converter valores existentes por mapa explícito.
- `custom_quizzes (id, student_id, title, block_size CHECK IN (5,10), created_at)`.
- `custom_quiz_questions (id, quiz_id, student_id, vocabulary_item_id, context_id NULL, prompt_text, expected_answer, position)` com chaves compostas pelo dono. O progresso do quiz entra em `reviews` e `study_sessions.quiz_id`.
- `study_sessions.session_type`: incluir os modos reais da tela (`full`, `weak_items`, `consolidation`, `maintenance`, `free_practice`, `specific_verb`, `custom_quiz`, além dos já existentes). Confirmar no código os valores enviados.
- `sentences.source`: aceitar `generated`.
- `vocabulary_items.language_code VARCHAR(10) NOT NULL DEFAULT 'en'`.
- Gatilho genérico `set_updated_at()`.
- Índices: um por chave estrangeira usada em junção; compostos como `student_vocabulary (student_id, review_priority DESC)` e `reviews (student_id, reviewed_at)`.

## 7. Notas de PostgreSQL 18
- Tabelas novas: preferir `GENERATED ALWAYS AS IDENTITY` a `SERIAL`. Não converter tabelas existentes sem necessidade.
- `TIMESTAMPTZ` já é usado; manter.
- Tabelas de apoio (`tenses`) em vez de `ENUM`: mais fácil de evoluir com migração.
- `gen_random_uuid()` é nativo desde o PostgreSQL 13; a extensão `pgcrypto` só é necessária se o código usar suas outras funções.

## 8. Gerador offline de frases
- Entrada: verbo (com `verb_forms`), tempo verbal, sujeito opcional. Saída: lista de sugestões.
- Regras por tempo: Present Simple (base / 3ª pessoa), Past Simple, Present Perfect (have/has + particípio), Future (will + base), Past Continuous (was/were + -ing), Present Perfect Continuous (have/has been + -ing) etc.
- Verbos irregulares: usar sempre `verb_forms`. Regulares: -ed, -ing, -s/-es, y→ied/ies, dobra de consoante; se a regra for duvidosa, avisar para o usuário revisar.
- Complementos vêm dos contextos cadastrados (ex.: `avoid people` → "I avoid people."), o que mantém a frase coerente com a palavra.
- Função pura em `server/src/services/sentenceGenerator.js`, testada com Jest. Nada de rede.
- Sugestões não são gravadas até o usuário aprovar (`source='generated'`).

## 9. Backup e restauração
```bash
# backup (senha via PGPASSWORD ou ~/.pgpass; nunca no plano)
pg_dump -Fc -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ~/backups/srb-$(date +%Y%m%d-%H%M).dump

# restaurar numa cópia de teste
createdb -h "$DB_HOST" -U "$DB_USER" srb_teste
pg_restore -h "$DB_HOST" -U "$DB_USER" -d srb_teste ~/backups/srb-AAAAMMDD-HHMM.dump
```

### Versão para Windows (PowerShell)
```powershell
# valores de host, porta, usuário e banco vêm do .env; a senha vale só nesta sessão e nunca vai para arquivo
$pg  = "C:\Program Files\PostgreSQL\18\bin"      # confirme o caminho real
$env:PGPASSWORD = Read-Host "Senha do PostgreSQL"
New-Item -ItemType Directory -Force "$HOME\backups" | Out-Null
$arq = "$HOME\backups\srb-$(Get-Date -Format yyyyMMdd-HHmm).dump"
& "$pg\pg_dump.exe" -Fc -h <DB_HOST> -p <DB_PORT> -U <DB_USER> -d <DB_NAME> -f $arq

# restaurar numa cópia de teste
& "$pg\createdb.exe" -h <DB_HOST> -p <DB_PORT> -U <DB_USER> srb_teste
& "$pg\pg_restore.exe" -h <DB_HOST> -p <DB_PORT> -U <DB_USER> -d srb_teste $arq
```
