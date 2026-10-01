# 🇺🇸 English Study Platform — Progresso da Build

> **Projeto:** Plataforma pessoal de estudos de inglês  
> **Stack:** React (Vite) + Node.js/Express + PostgreSQL 18  
> **Banco:** `reviewdatabase` @ localhost:5432, user: postgres  
> **Raiz do projeto:** `c:\Users\opera\Desktop\Training Verbs\`  
> **Frontend:** `http://localhost:5173` | **Backend:** `http://localhost:3001`

---

## ✅ CONCLUÍDO

### FASE 1 — Inspeção do projeto e skills
- [x] Lida `skill3.md` (prompt principal e especificações do sistema)
- [x] Lida `skill.md` (metodologia pedagógica de repetição espaçada e contextos)
- [x] Lida `skill2.md` (design do dashboard)

### FASE 2 — Inspeção do ambiente e banco
- [x] Node.js v24 + npm + Git verificados
- [x] PostgreSQL 18 configurado no banco `reviewdatabase`
- [x] `.env` na raiz com credenciais da aplicação

### FASE 3 — Backend (Node.js + Express + PostgreSQL)
- [x] `server/src/index.js` — Servidor Express com CORS, health check e logging
- [x] `server/src/db/connection.js` — Pool PostgreSQL com lazy initialization
- [x] `server/src/db/schema.sql` — Schema relacional completo com 14 tabelas:
  - `students`, `vocabulary_items`, `verb_forms`, `meanings`, `contexts`
  - `sentences`, `paragraphs`, `paragraph_vocabulary`
  - `student_vocabulary`, `tense_practice`, `context_mastery`
  - `study_sessions`, `reviews`, `errors`, `student_sentences`
- [x] `server/src/db/migrate.js` e `seed.js` — Migrations e carga inicial de 6 verbos reais
- [x] Rotas da API REST completas:
  - `GET /api/health`
  - `GET, POST, PATCH, DELETE /api/students`
  - `GET, POST, PATCH /api/vocabulary` + sub-recursos `/sentences` e `/contexts`
  - `GET /api/vocabulary/:id` — Corrigido `s.session_type` (resolvido erro 500 "coluna s.name não existe" e "Verbo não encontrado")
  - `GET /api/reviews/queue` — Fila inteligente SRS com modos `mixed`, `review`, `weak_items`, `new_acquisition`
  - `POST /api/reviews` — Registro de revisão com atualização do algoritmo SRS
  - `GET, POST /api/sentences` e parágrafos `/api/sentences/paragraphs`
  - `POST, PATCH, GET /api/sessions` — Corrigido mapeamento de `session_type` (resolvido erro de restrição de verificação `study_sessions_session_type_check`)
  - `GET /api/dashboard` — Métricas, estatísticas, retenção e revisões prioritárias
- [x] `server/src/services/srs.js` — Algoritmo SRS com cálculo de prioridade e interleaving

### FASE 4 — Frontend (React 18 + Vite + SPA)
- [x] Configuração Vite com proxy `/api` apontando para `http://localhost:3001`
- [x] Design System completo em `index.css` (Dark theme premium, glassmorphism, badges, botões, responsivo)
- [x] Contexto global `AppContext.jsx` gerenciando o aluno ativo
- [x] Páginas implementadas:
  - `/` — Seleção de Estudante (`StudentSelect.jsx`)
  - `/dashboard` — Painel com KPIs, gráficos, atalhos rápidos e status de revisão (`Dashboard.jsx`)
  - `/study` — Sessão de Estudo Flashcard com modos, auditoria SRS e avaliação (`StudySession.jsx`)
  - `/vocabulary` — Lista com busca e filtros por nível, tipo e status (`VocabList.jsx`)
  - `/vocabulary/:id` — Detalhes completos do verbo com conjugações, contextos, frases e histórico (`VocabDetail.jsx`)
  - `/add-verb` — Formulário de cadastro de novo vocabulário (`AddVerb.jsx`)
  - `/sentences` — Biblioteca de frases com filtros (`SentencesPage.jsx`)
  - `/paragraphs` — Textos e parágrafos conectados ao vocabulário (`ParagraphsPage.jsx`)
  - `/progress` — Histórico de sessões, taxa de acerto e evolução (`ProgressPage.jsx`)
  - `/search` — Busca avançada (`SearchPage.jsx`)
- [x] Componente TTS com voz nativa em inglês (`en-US` / `en-GB`) configurado no navegador

### FASE 5 — Documentação
- [x] `README.md` completo na raiz do projeto com arquitetura, comandos e instruções para Windows/PowerShell

---

## 🔄 EM ANDAMENTO / ÚLTIMAS CORREÇÕES

- [x] **Correção do Bug `study_sessions_session_type_check`**: 
  - Normalização no endpoint `POST /api/sessions` mapeando `weak` -> `weak_items` e `new` -> `new_acquisition`
  - Tratamento de `studentId` obrigatório e fallback seguro para `'mixed'`
  - Atualização do frontend `StudySession.jsx` com verificação de fila vazia e aviso amigável
- [x] **Correção do Bug "Verbo não encontrado."**:
  - Corrigida consulta em `server/src/routes/vocabulary.js` (linha 110: `s.session_type` em vez de `s.name`)
- [x] **Correção da Pronúncia e Sotaque no TTS**:
  - Criado mecanismo de detecção de vozes nativas em inglês no Windows (Microsoft Jenny Natural, Google US English, Microsoft David/Zira Desktop)
  - Rejeição estrita de vozes em português/outras línguas
  - Implementado fallback automático para Áudio Nativo Americano HD via stream de pronúncia oficial
- [x] **Correção do Registro de Revisões e Desempenho (🔴 / 🟡 / 🟢)**:
  - Corrigido erro de SQL no PostgreSQL que bloqueava o salvamento da revisão (`tipos inconsistentes deduzidos do parâmetro $10` e `recent_errors INTEGER`)
  - No frontend, os botões 🔴 Difícil, 🟡 Parcial e 🟢 Fácil agora registram a avaliação no banco, atualizam o nível de domínio do aluno (verde/amarelo/vermelho) e avançam automaticamente para a próxima palavra
  - Adicionado estado de salvamento (`submitting`), prevenção de duplo clique e aviso de erro visual caso ocorra problema de conexão
- [x] **Calibração da Progressão de Domínio, Cores e Nível CEFR**:
  - Ajustado o algoritmo de SRS para refletir imediatamente o esforço do aluno:
    - 1º acerto: sai do Vermelho e vai para Amarelo (Intermediário / Em progresso)
    - 2+ acertos consecutivos: sobe para Verde (Dominado / Excelente)
  - Sincronizado o status das frases (`sentences`), agora marcadas como `mastered` ao acertar revisões
  - Gráficos de Domínio por Nível CEFR no Dashboard agora exibem barras de progresso reais, coloridas e clicáveis
- [x] **Gestão de Estudantes e Usuário Principal no Banco**:
  - Usuário principal `Filipe` (ID: 1, Nível: B1) confirmado no banco com vocabulário, histórico e revisões
  - `POST /api/students` aprimorado para vincular automaticamente todo o vocabulário existente ao novo estudante criado e configurar a prática de tempos verbais
  - Adicionado botão para exclusão de estudantes (`DELETE /api/students/:id`) diretamente no card de seleção (`StudentSelect.jsx`)
- [x] **Cadastro, Edição e Exclusão Completa de Verbos (CRUD)**:
  - Criação de novos verbos (`POST /api/vocabulary`) agora sincroniza automaticamente para todos os estudantes do banco
  - Criado endpoint `DELETE /api/vocabulary/:id` com limpeza limpa em cascata de frases, revisões e vínculos
  - Adicionado formulário de edição dos dados principais do verbo (`PATCH /api/vocabulary/:id`) na tela de detalhes (`VocabDetail.jsx`) com alteração de palavra, significado principal, nível CEFR, dificuldade, status de irregular e notas
  - Adicionado botão "🗑️ Excluir" com confirmação na tela de detalhes do verbo
- [x] **Quiz Personalizado (Modo Anki)**:
  - Interface para o aluno/professor criar perguntas específicas para frases/verbos em blocos de 5 ou 10 questões
  - Algoritmo de repetição que prioriza os maiores índices de erro e afunila o aprendizado

---

## ⏳ PENDENTE (O QUE FALTA FAZER)

- [ ] **Validação pelo Usuário no Navegador**:
  - Testar o login/seleção com o usuário principal `Filipe` ou criar um novo
  - Testar o cadastro, edição e exclusão de verbos
  - Realizar um bloco de estudo ou quiz personalizado e conferir as respostas
- [ ] **Validação da Suíte de Testes Automatizados**:
  - Rodar suíte de testes finais (Vitest no front e Jest no back)

---

## 📋 COMANDOS PARA INICIAR A APLICAÇÃO

```powershell
# TERMINAL 1 — Backend (API)
cd "c:\Users\opera\Desktop\Training Verbs\server"
npm run dev

# TERMINAL 2 — Frontend (Vite)
cd "c:\Users\opera\Desktop\Training Verbs\client"
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend Health:** http://localhost:3001/api/health
