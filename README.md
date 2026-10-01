# 🚀 StudyReviewBlast

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

> Plataforma open source de repetição espaçada e quizzes dinâmicos para retenção acelerada de vocabulário e estruturas em inglês.

O **StudyReviewBlast** combina os fundamentos da repetição espaçada (*Spaced Repetition System - SRS*) e princípios de *Active Recall* para transformar o estudo de verbos e vocabulário em uma prática ativa de alta retenção. O sistema prioriza itens com maior taxa de erro e permite a criação de quizzes customizáveis organizados em blocos de 5 ou 10 questões. Através de pistas contextuais e frases com lacuna (*cloze tests*), o estudante exercita a recuperação da informação antes de consultar a resposta.

---

## 📑 Sumário

- [Funcionalidades](#-funcionalidades)
- [Tecnologias e Versões](#-tecnologias-e-versões)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração de Ambiente](#-configuração-de-ambiente)
- [Execução](#-execução)
- [Endpoints da API](#-endpoints-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes e Qualidade](#-testes-e-qualidade)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## ✨ Funcionalidades

- **🃏 Quizzes Personalizados (Modo Anki Customizado):** Criação e edição de perguntas personalizadas agrupadas em blocos ágeis de 5 ou 10 questões, com chips que inserem contextos e frases de exemplo diretamente no enunciado.
- **🎯 Algoritmo de Afunilamento de Erros (SRS):** Cálculo dinâmico de prioridade com base em frequência de erro, recência e intervalo de revisão, empurrando itens fracos para o topo da fila.
- **🧠 Active Recall com Pistas Contextuais:**
  - *Contextos de Uso:* Exibe contextos naturais associados ao verbo (ex.: `avoid people`, `avoid conflict`) para ativar a memória antes da resposta.
  - *Frase com Lacuna (Cloze Test):* Oculta o verbo alvo na frase (`[ _______ ]`) para estimular a recuperação da conjugação e sintaxe no tempo verbal correto.
- **🔊 Síntese de Voz Nativa em Inglês (TTS):** Seleção inteligente de vozes nativas (`en-US` e `en-GB`) com rejeição de sotaques incompatíveis e fallback automático para stream de pronúncia em áudio HD.
- **📚 Gestão Completa de Vocabulário (CRUD):** Cadastro, edição completa de campos (palavra, significado principal, nível CEFR, dificuldade, irregularidade e notas), edição inline de frases e múltiplos significados, e exclusão com limpeza segura em cascata.
- **👥 Gestão de Estudantes:** Seleção rápida de perfis, criação com vínculo automático a todo o vocabulário existente e exclusão simplificada.
- **📊 Painel Analítico de Desempenho:** Dashboard com métricas de retenção, taxa de acertos, distribuição de domínio por nível CEFR (A1 a C1) e categorização de erros gramaticais.

---

## 🛠 Tecnologias e Versões

| Camada | Tecnologia | Versão Declarada | Papel no Projeto |
|---|---|---|---|
| **Runtime & Linguagem** | Node.js | `>= 18.0.0` | Ambiente de execução JavaScript no servidor |
| **Backend** | Express | `^4.18.2` | Framework HTTP para criação de rotas e middlewares da API REST |
| **Banco de Dados** | PostgreSQL | `>= 14.0.0` | Banco relacional para armazenamento de estudantes, vocabulário e revisões |
| **Driver de Banco** | pg (node-postgres) | `^8.11.3` | Pool de conexão e execução de queries com PostgreSQL |
| **Frontend** | React | `^19.2.8` | Biblioteca de interface reativa para a aplicação web (SPA) |
| **Frontend Bundler** | Vite | `^8.3.0` | Build tool e servidor de desenvolvimento frontend com HMR |
| **Roteamento** | react-router-dom | `^7.18.4` | Gerenciamento de rotas e navegação client-side |
| **Comunicação HTTP** | Axios | `^1.20.0` | Cliente HTTP para integração entre o cliente React e a API |
| **Gráficos** | Chart.js / react-chartjs-2 | `^4.5.1` / `^5.3.1` | Renderização visual de KPIs de retenção e distribuição CEFR |
| **Testes (Backend)** | Jest / Supertest | `^29.7.0` / `^7.3.0` | Testes de integração de endpoints e validação do algoritmo SRS |
| **Testes (Frontend)** | Vitest / Testing Library | `^5.0.3` / `^16.3.3` | Testes unitários e de componentes de interface React |
| **Qualidade & Linting** | Oxlint | `^1.81.0` | Análise estática ultrarrápida do código frontend |

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado em seu ambiente:

- **Node.js:** Versão 18 ou superior (`node --version`)
- **npm:** Versão 9 ou superior (`npm --version`)
- **PostgreSQL:** Versão 14 ou superior com serviço em execução na porta `5432`

---

## 🚀 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/mghkill/Study-Review-Blast.git
   cd Study-Review-Blast
   ```

2. **Instale as dependências do Backend:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Instale as dependências do Frontend:**
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## ⚙️ Configuração de Ambiente

Crie o arquivo `.env` na raiz do projeto (ou copie a partir do modelo [.env.example](./.env.example)):

```bash
cp .env.example .env
```

### Variáveis Disponíveis

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `DB_HOST` | Sim | Endereço do servidor PostgreSQL | `localhost` |
| `DB_PORT` | Sim | Porta de conexão do PostgreSQL | `5432` |
| `DB_NAME` | Sim | Nome da base de dados da aplicação | `reviewdatabase` |
| `DB_USER` | Sim | Usuário de autenticação do PostgreSQL | `postgres` |
| `DB_PASSWORD` | Sim | Senha do usuário do banco de dados | `sua_senha_local` |
| `PORT` | Não | Porta de execução do servidor Express | `3001` |
| `NODE_ENV` | Não | Ambiente de execução (`development`/`production`) | `development` |

> ⚠️ **Atenção:** Nunca versione arquivos `.env` contendo credenciais reais de produção.

---

## 🏁 Execução

### 1. Migração e Carga Inicial do Banco (Seeds)

Na pasta `server`, execute os scripts para estruturar as tabelas e carregar dados demonstrativos:

```bash
# Executa a criação das 14 tabelas relacionais
npm run migrate --prefix server

# Popula o banco com o estudante inicial (Filipe) e 6 verbos completos
npm run seed --prefix server
```

### 2. Iniciar os Servidores de Desenvolvimento

Abra dois terminais independentes:

- **Terminal 1 — Backend (Porta 3001):**
  ```bash
  cd server
  npm run dev
  ```
  *Health check:* [http://localhost:3001/api/health](http://localhost:3001/api/health)

- **Terminal 2 — Frontend (Porta 5173):**
  ```bash
  cd client
  npm run dev
  ```
  *Acesso no navegador:* [http://localhost:5173/](http://localhost:5173/)

---

## 🌐 Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status de saúde da aplicação e conectividade com o banco |
| `GET`, `POST` | `/api/students` | Listagem e criação de perfis de estudantes |
| `DELETE` | `/api/students/:id` | Remoção de estudante e seu histórico |
| `GET`, `POST` | `/api/vocabulary` | Consulta e cadastro de itens de vocabulário |
| `GET`, `PATCH`, `DELETE` | `/api/vocabulary/:id` | Detalhes, atualização e exclusão em cascata de verbo |
| `GET` | `/api/reviews/queue` | Fila inteligente do algoritmo SRS para sessões de estudo |
| `POST` | `/api/reviews` | Registro de revisão e recálculo de intervalos espaçados |
| `POST` | `/api/sessions` | Registro de sessões de estudo (misto, revisão ou custom quiz) |
| `GET` | `/api/dashboard` | Indicadores de retenção, acertos e distribuição CEFR |
| `GET`, `POST` | `/api/sentences` | Banco global de frases de exemplo |

---

## 📁 Estrutura do Projeto

```text
Study-Review-Blast/
├── client/                      # Aplicação Frontend React (Vite)
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis (UI, TTSButton, Badges)
│   │   ├── context/             # Contexto global de estado do estudante ativo
│   │   ├── pages/               # Telas (Dashboard, StudySession, VocabDetail, etc.)
│   │   ├── api.js               # Camada de comunicação HTTP com o backend
│   │   └── index.css            # Design System (dark theme, glassmorphism)
│   ├── package.json
│   └── vite.config.js
├── server/                      # API Backend Node.js / Express
│   ├── src/
│   │   ├── db/                  # Conexão, migrations (schema.sql) e seeds
│   │   ├── routes/              # Rotas da API (students, vocabulary, reviews, etc.)
│   │   ├── services/            # Lógica de negócio do algoritmo SRS
│   │   └── index.js             # Ponto de entrada do servidor Express
│   ├── tests/                   # Testes automatizados Jest/Supertest
│   └── package.json
├── skills/                      # Metodologia pedagógica e planos diretores
├── .env.example                 # Modelo limpo de variáveis de ambiente
└── README.md                    # Documentação principal do projeto
```

---

## 🧪 Testes e Qualidade

Execute as suítes de validação automatizadas em seus respectivos diretórios:

- **Testes do Frontend (Vitest):**
  ```bash
  cd client
  npm run test:run
  ```

- **Verificação de Linter (Oxlint):**
  ```bash
  cd client
  npm run lint
  ```

- **Testes do Backend (Jest):**
  ```bash
  cd server
  npm test
  ```

---

## 🗺️ Roadmap

- [x] CRUD completo de vocabulário com edição inline e exclusão segura.
- [x] Integração de pistas de Active Recall (Contextos de Uso e Cloze Tests).
- [x] Quizzes dinâmicos personalizáveis em blocos de 5 e 10 questões.
- [x] Prática contínua ilimitada desvinculada de bloqueios de data.
- [ ] Exportação e importação de baralhos no formato CSV / JSON.
- [ ] Módulo de prática auditiva dedicada com transcrição de fala.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para propor melhorias ou correções:

1. Faça um Fork do projeto.
2. Crie uma branch para sua funcionalidade: `git checkout -b feature/minha-melhoria`.
3. Faça commit de suas alterações: `git commit -m 'feat: adiciona nova funcionalidade'`.
4. Envie para o repositório remoto: `git push origin feature/minha-melhoria`.
5. Abra um Pull Request detalhado.

---

## 📄 Licença

Este projeto é distribuído sob os termos da licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para obter mais informações.
