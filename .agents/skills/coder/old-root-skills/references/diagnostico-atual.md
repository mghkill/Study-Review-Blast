> ⚠️ **DOCUMENTO HISTÓRICO — SOMENTE LEITURA:** descreve o projeto ANTES do V1 e está desatualizado. Preservado para auditoria e rastreabilidade. Não usar como verdade; a T-004 deve gerar a matriz a partir do código real.

# Diagnóstico do estado atual

Baseado no README e no schema.sql enviados pelo usuário e na descrição das telas. **O código (rotas, componentes) ainda não foi lido**: tudo marcado "a confirmar" precisa ser verificado na Fase 0 antes de agir.

## 1. Divergências entre README e schema
| Assunto | README | schema.sql | Ação |
|---|---|---|---|
| Versão do PostgreSQL | `>= 14` | cabeçalho diz PostgreSQL 18 (versão que o usuário usa) | corrigir README para 18 |
| Quantidade de tabelas | 14 | 16 (students, vocabulary_items, verb_forms, meanings, contexts, sentences, paragraphs, paragraph_vocabulary, student_vocabulary, tense_practice, context_mastery, study_sessions, reviews, errors, pronunciation_practice, student_sentences) | contar de novo ao final |
| Tipos de sessão | "misto, revisão ou custom quiz" | CHECK aceita só mixed, new_acquisition, review, pronunciation, weak_items, specific_verb | conferir o que o código envia; ajustar via migration (T-041) |
| Modos de "Estudar Agora" | Sessão Completa, Foco nos Fracos, Consolidação, Manutenção/Fluência, Treino Livre | não existem consolidation, maintenance, free_practice, custom_quiz | idem |
| LICENSE e CONTRIBUTING.md | README aponta para ambos | a confirmar se existem | criar (Fase 7) |

## 2. Causas prováveis do vazamento entre estudantes
1. `vocabulary_items` não tem dono: é uma tabela global (`UNIQUE(word, type)`). O vínculo com o estudante está só em `student_vocabulary`.
2. O README diz que criar estudante faz "vínculo automático a todo o vocabulário existente": por desenho, todo estudante novo recebe as palavras dos outros.
3. O README descreve `/api/sentences` como "banco global de frases" e `sentences.student_id` aceita NULL.
4. A listagem de vocabulário e os contadores do Dashboard (Vocabulário Total, Frases cadastradas) podem consultar as tabelas globais em vez de passar por `student_vocabulary` (a confirmar no código).
5. Nada na API exige ou valida qual estudante está fazendo a requisição (a confirmar).

Isto provavelmente **não é um detalhe pequeno**: toca schema, migração de dados, todas as rotas e o cliente. É trabalho contido e bem definido (Fase 2), mas precisa de testes.

## 3. Riscos encontrados no schema
- `CREATE TABLE IF NOT EXISTS` não altera tabelas já criadas: mudanças no schema.sql não chegam a bancos existentes. Daí a necessidade de migrações versionadas (Fase 1).
- `updated_at` só recebe valor na criação; sem gatilho, fica desatualizado.
- Chaves estrangeiras sem índice (PostgreSQL não cria índice automático no lado que referencia): `meanings`, `contexts`, `verb_forms`, `sentences.student_id`, `sentences.context_id`, `reviews.session_id`, `errors.review_id` entre outras.
- `reviews.context_practiced` referencia `contexts` sem regra de `ON DELETE`: excluir um contexto que já foi praticado falha.
- `tense`, `tense_practiced` são texto livre (`'Present Simple'` vs `'present_simple'` quebram estatísticas).
- Não há tabela para Quiz Personalizado, mas a tela existe.
- A extensão `pgcrypto` é criada e aparentemente não é usada (conferir).
- `student_vocabulary.status` (green/yellow/red) é derivável de `mastery_level`; manter só se o código depender dele.

## 4. Matriz de cobertura inicial (tela → o que o schema oferece)
| Tela | Suporte no schema | Observação |
|---|---|---|
| Detalhes da Palavra | vocabulary_items, meanings, contexts, tense_practice, student_vocabulary | "praticado/não praticado" vem de context_mastery |
| Estudar Agora | study_sessions, student_vocabulary | modos novos exigem ajuste de CHECK |
| Dashboard | student_vocabulary, sentences, reviews, errors | tudo precisa filtrar por estudante |
| Vocabulário | vocabulary_items + student_vocabulary | filtros tipo/nível/status; "Alta prioridade" = review_priority |
| Progresso | reviews, errors, study_sessions | agrupar por semana e por nível CEFR |
| Prática/Revisão | reviews, errors, pronunciation_practice | tempo verbal, avaliação de pronúncia, categorias de erro |
| Quiz Personalizado | **sem tabela** | criar custom_quizzes e custom_quiz_questions |
| Novo Verbo | vocabulary_items, verb_forms, meanings, contexts | gravar tudo numa transação |
| Banco de Frases | sentences | hoje global; precisa de dono; ganhar `generated` |
