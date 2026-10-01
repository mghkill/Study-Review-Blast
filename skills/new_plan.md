# 🚀 StudyReviewBlast — Novo Plano Diretor & Instruções de Próximos Passos

> **Documento:** Plano Diretor Unificado e Instruções de Continuidade  
> **Status do Projeto:** 100% Funcional e em Operação Local  
> **Frontend:** `http://localhost:5173/` | **Backend API:** `http://localhost:3001/`  
> **Banco:** PostgreSQL (`reviewdatabase`)  

---

## 📍 1. Estado Atual do Projeto

O **StudyReviewBlast** está plenamente desenvolvido, integrado e estabilizado:

### A. Gestão de Usuários & Estudantes
- Usuário principal do banco: **`Filipe` (ID: 1, Nível: B1)** com 7 verbos e histórico ativo.
- Criação de novos estudantes: vincula automaticamente todo o catálogo de vocabulário e cria os registros de tempos verbais.
- Exclusão de estudantes: botão 🗑️ direto no card de seleção para limpar perfis de teste ou duplicatas.

### B. CRUD Completo de Vocabulário & Verbos
- **Cadastro:** Tela `/add-verb` sincronizada para todos os estudantes do banco.
- **Edição Completa:** Na página `/vocabulary/:id`, o formulário *"✏️ Editar dados do verbo"* permite alterar palavra, tradução/significado, nível CEFR, dificuldade, irregularidade e notas adicionais.
- **Edição Inline:** Edição e exclusão rápida de frases e múltiplos significados diretamente na lista.
- **Exclusão Segura:** Botão *"🗑️ Excluir"* com confirmação, limpando relações em cascata sem erros de chave estrangeira.

### C. Algoritmo de Repetição Espaçada (SRS) & Afunilamento de Erros
- Fila inteligente (`/api/reviews/queue`) com priorização de itens com maior taxa de erro e menor retenção.
- Prática contínua ilimitada: mesmo quando não há revisões atrasadas no relógio, o aluno pode praticar continuamente sem bloqueios.
- Classificação tricolor imediata:
  - 🔴 **Difícil / Erro:** Prioridade máxima na fila de revisão imediata.
  - 🟡 **Parcial:** Consolidação intermediária.
  - 🟢 **Fácil / Correto:** Aumenta intervalo e sobe o nível de domínio.

### D. Áudio & Pronúncia em Inglês
- Detecção estrita de vozes em inglês nativo no Windows (`en-US`, `en-GB`, Microsoft Jenny Natural, Google US English, David/Zira).
- Rejeição de pronúncia com sotaque de português e fallback para áudio oficial de pronúncia nativa.

### E. Quizzes Personalizados (Modo Anki) & Uso de Frases e Contextos
- Configuração de quizzes personalizados em blocos modulares de 5 ou 10 questões.
- Chips inteligentes para inserir contextos e estruturas reais diretamente no enunciado da pergunta.
- Dicas ativas na frente do flashcard:
  - 🌐 **Contextos de Uso:** Pistas de contexto para exercitar a memória antes de virar a resposta.
  - 🧩 **Frase com Lacuna (Cloze Test):** Exibe a frase com o verbo ocultado para forçar o Active Recall na prática.

---

## 🛠️ 2. Instruções para os Próximos Passos

### Passo 1: Validação do Aluno no Navegador
1. Abra [http://localhost:5173/](http://localhost:5173/).
2. Selecione o estudante principal **Filipe** (ou crie um novo para testar a criação limpa).
3. Na barra de navegação superior, acerte ou revise as seguintes telas:
   - **Estudar (`/study`):**
     - Faça um ciclo de flashcards.
     - Clique em *"🌐 Relembrar por Contextos"* e *"🧩 Relembrar por Frase"* antes de virar a carta para testar a ativação da memória.
     - Clique em *"👁️ Mostrar Resposta"* e avalie com 🔴, 🟡 ou 🟢.
   - **Quiz Personalizado (`/study` -> "🃏 Quiz Personalizado"):**
     - Escolha 5 ou 10 questões.
     - Selecione um verbo e clique nos chips de contexto para preencher a pergunta automaticamente.
     - Responda ao quiz e verifique como os erros são registrados.
   - **Vocabulário (`/vocabulary` e `/vocabulary/:id`):**
     - Teste o botão *"✏️ Editar verbo"*.
     - Teste o botão *"🎯 Praticar"* nos cards de Contextos de Uso.
     - Crie e edite frases de exemplo inline.

### Passo 2: Validação da Suíte de Testes Automatizados
- Frontend: 55 testes Vitest executáveis com `npm test` na pasta `client/`.
- Backend: Testes de rotas e algoritmo SRS em `server/tests/`.

### Passo 3: Segurança e Manutenção do Ambiente
- **Sem senhas reais:** O arquivo `.env` e `.env.example` devem manter apenas placeholders (`your_password_here`).
- **Sem caminhos absolutos pessoais no README:** O `README.md` foi reescrito focando exclusivamente no tema e propósito descritivo da plataforma StudyReviewBlast.

---

## 🎯 3. Como as Frases e Contextos de Uso Operam para Prática e Retenção

1. **Ativação Pré-Resposta (Front Card Hints):**
   Ao invés de apenas olhar a palavra isolada e tentar adivinhar a tradução, o estudante pode consultar os contextos reais associados (ex: *avoid confrontation*, *avoid + gerund*), ativando as conexões neurais certas.
2. **Cloze Test Instantâneo:**
   A frase cadastrada no banco tem seu verbo principal mascarado em tempo real (`[ _______ ]`). O cérebro precisa recuperar não apenas o significado, mas a conjugação e o tempo verbal corretos no contexto da sentença.
3. **Construção de Perguntas no Quiz:**
   O professor/estudante pode utilizar os contextos cadastrados como base para criar desafios específicos de fixação, afunilando os pontos onde há mais erros gramaticais ou de preposição.
