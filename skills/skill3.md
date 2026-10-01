# CONSTRUA MINHA PLATAFORMA PESSOAL DE ESTUDOS DE INGLÊS

Quero que você atue como **arquiteto de software, desenvolvedor full-stack e especialista em sistemas de aprendizagem baseada em repetição espaçada**, construindo uma aplicação web local para meu estudo particular de inglês.

A aplicação será utilizada apenas por mim e não precisa de autenticação, login, cadastro por e-mail ou qualquer infraestrutura de produção.

O sistema deve funcionar na minha própria máquina através de `localhost`.

---

# 1. ANTES DE COMEÇAR: INSPECIONE O PROJETO

Antes de escrever código:

1. Examine a estrutura atual do projeto.
2. Verifique se já existem arquivos, componentes, configurações ou banco de dados que possam ser aproveitados.
3. Leia obrigatoriamente:

```text
/skills/skill.md
```

4. Se existir alguma segunda skill relacionada ao sistema de estudos, leia também, especialmente:

```text
/skills/skill2/
```

ou qualquer arquivo equivalente dentro de `/skills/` que contenha instruções para o comportamento do professor/exercício.

**A skill é parte fundamental deste projeto.**

Não ignore suas instruções.

Quero que você entenda o que a IA/professor externo deverá fazer e construa a plataforma de modo que ela seja compatível com esse fluxo.

Se houver conflito entre este prompt e uma skill existente, analise o conflito e preserve a intenção pedagógica deste projeto.

Não substitua a skill por uma implementação improvisada.

---

# 2. PRIMEIRO OBJETIVO DO SISTEMA

A aplicação será uma espécie de:

> **ANKI + caderno de frases + treinador de verbos + painel de progresso**

voltada especificamente para aquisição ativa de vocabulário e domínio de verbos em inglês.

O objetivo não é simplesmente memorizar:

> verb = tradução

O objetivo é aprender:

> palavra → significado → contexto → estrutura → frase → uso → tempo verbal → produção → repetição → domínio

O sistema deve registrar o desenvolvimento do estudante ao longo do tempo.

---

# 3. O FOCO PRINCIPAL: VERBOS

O sistema deve permitir que eu:

* insira um verbo novo;
* selecione um verbo existente;
* veja os verbos que já estou estudando;
* veja quais verbos estão fracos;
* veja quais precisam ser revisados;
* registre novas frases;
* registre novos parágrafos;
* pratique diferentes tempos verbais;
* pratique diferentes sentidos do mesmo verbo;
* registre erros;
* registre acertos;
* acompanhe a evolução daquele verbo.

Exemplo:

```text
VERB: run
```

O sistema deve permitir que esse verbo evolua de algo simples como:

> I run every morning.

para aplicações progressivamente mais complexas:

> She runs a small company.

> He ran into an old friend yesterday.

> The program is running in the background.

> If the system runs correctly, we can continue.

O objetivo é construir uma **rede de usos do verbo**, e não apenas armazenar sua tradução.

---

# 4. O SISTEMA NÃO DEVE SER EXCLUSIVO PARA VERBOS

Embora verbos sejam o foco inicial, a arquitetura deve permitir posteriormente cadastrar:

* substantivos;
* adjetivos;
* advérbios;
* preposições;
* phrasal verbs;
* expressões;
* collocations;
* estruturas gramaticais;
* frases completas.

Crie uma estrutura de dados suficientemente genérica para isso.

Por exemplo:

```text
Vocabulary Item
├── Word
├── Type
├── Level
├── Meaning
├── Contexts
├── Examples
├── Learning status
└── Review history
```

O campo `type` poderá ser:

```text
verb
noun
adjective
adverb
preposition
phrasal_verb
expression
grammar
other
```

---

# 5. NÍVEIS

O sistema deverá trabalhar inicialmente com:

```text
A1
A2
B1
B2
C1
```

Mesmo que inicialmente eu esteja interessado principalmente em A1–B2, prepare a estrutura para C1.

Cada palavra/verbo poderá possuir um nível.

Também deve existir um nível geral do estudante:

```text
A1
A2
B1
B2
C1
```

Esse nível não deve ser simplesmente alterado manualmente com base em quantidade de palavras.

Deixe preparado para posteriormente calcular indicadores de domínio.

---

# 6. NÃO IMPLEMENTAR IA DENTRO DO SITE

IMPORTANTE:

**Não quero integrar uma API de IA ao site neste momento.**

Não adicione:

* OpenAI API;
* chatbot;
* modelo local;
* reconhecimento de voz por IA;
* correção automática por LLM;
* API paga de inteligência artificial.

O professor particular/IA ficará fora da aplicação.

A aplicação será o **sistema de registro, organização, repetição e análise do aprendizado**.

Eu utilizarei o professor externo para gerar/exercitar o conteúdo conforme a skill.

---

# 7. PROFESSOR PARTICULAR EXTERNO

Durante meus estudos, haverá um professor particular ao meu lado.

Esse professor poderá me apresentar uma frase, pergunta, exercício ou parágrafo.

Eu poderei registrar esse conteúdo no sistema.

Por exemplo:

```text
Verb:
avoid

Sentence:
I avoid unnecessary arguments at work.
```

O sistema deverá permitir salvar essa frase associada ao verbo.

Depois ela poderá aparecer novamente nas revisões.

---

# 8. REGISTRO DE FRASES E PARÁGRAFOS

Uma das funções mais importantes da aplicação será registrar aquilo que realmente foi aprendido.

Para cada item, permitir:

```text
Palavra
Sentido
Frase
Tradução opcional
Contexto
Tempo verbal
Data de aquisição
Status
```

E também:

```text
Parágrafo
```

Um parágrafo deve poder utilizar vários vocabulários.

Exemplo:

```text
I usually avoid unnecessary conflicts at work.
However, when a problem appears, I try to deal with it calmly.
If the situation becomes serious, I discuss it with my manager.
```

Esse parágrafo deverá ficar associado aos vocabulários utilizados nele.

---

# 9. TEMPOS VERBAIS

Para verbos, o sistema deverá registrar quais tempos verbais já foram praticados.

Inicialmente:

```text
Present Simple
Present Continuous
Past Simple
Past Continuous
Present Perfect
Past Perfect
Future
Future with will
Going to
Modal constructions
Conditionals
```

A estrutura deve permitir adicionar outros posteriormente.

Para cada verbo, quero poder visualizar algo como:

```text
RUN

✓ Present Simple
✓ Past Simple
✓ Present Continuous
○ Present Perfect
○ Past Perfect
○ Conditional
```

Isso não significa que simplesmente "marcar" um tempo verbal fará com que ele seja considerado dominado.

O sistema deve registrar:

* prática;
* acertos;
* erros;
* quantidade de revisões;
* última prática;
* desempenho.

---

# 10. CICLO PEDAGÓGICO

A aplicação deverá organizar o estudo em ciclos.

O ciclo principal será:

```text
NOVA AQUISIÇÃO
       ↓
PRÁTICA
       ↓
PRÁTICA VOCAL / PRONÚNCIA
       ↓
REVISÃO
       ↓
ERRO?
 ┌─────┴─────┐
SIM          NÃO
 ↓            ↓
Reforço      Intervalo maior
 ↓            ↓
Nova revisão ←┘
```

O sistema deverá priorizar aquilo que está sendo esquecido.

---

# 11. ESCALA DE APRENDIZADO

Crie uma escala de domínio.

Sugestão inicial:

```text
0 — Não aprendido
1 — Reconheço
2 — Consigo lembrar com ajuda
3 — Consigo produzir
4 — Consigo utilizar em contexto
5 — Domínio consistente
```

Também quero uma classificação visual:

### VERDE

Excelente / domínio consistente

### AMARELO

Intermediário / precisa de reforço

### VERMELHO

Fraco / precisa de revisão prioritária

Não use apenas uma média simples.

O algoritmo deve considerar histórico.

---

# 12. REPETIÇÃO ESPAÇADA

Implemente um algoritmo próprio inspirado em sistemas de repetição espaçada.

Não é necessário reproduzir exatamente o algoritmo do Anki.

O objetivo é:

> quanto melhor o desempenho → maior intervalo

e:

> quanto pior o desempenho → menor intervalo

Porém, existe uma regra especialmente importante:

## ERROS DEVEM PESAR MAIS

Se eu errar repetidamente um verbo ou frase, esse item deve subir na prioridade.

Exemplo:

```text
avoid
10 revisões
9 acertos
1 erro
```

deve ter prioridade menor que:

```text
conduct
10 revisões
4 acertos
6 erros
```

Além da taxa de erro, considere:

* quantidade total de erros;
* erros recentes;
* sequência de erros;
* tempo desde a última revisão;
* quantidade de revisões;
* nível de domínio;
* dificuldade do item;
* tempo verbal associado;
* contexto específico em que o erro ocorreu.

---

# 13. PRIORIDADE DE REVISÃO

Crie um sistema de prioridade.

Cada item deve receber algo semelhante a:

```text
review_priority
```

Quanto maior o valor, maior a prioridade.

Uma fórmula possível:

```text
priority =
    error_weight
    + recency_weight
    + difficulty_weight
    + overdue_weight
    + weakness_weight
```

Você pode criar uma fórmula melhor se encontrar uma abordagem mais adequada.

Mas documente claramente a lógica utilizada.

**Não quero uma fórmula arbitrária sem explicação.**

---

# 14. ERROS ESPECÍFICOS

Não registre apenas:

> verbo errado.

Quero que o sistema possa identificar onde ocorreu o problema.

Por exemplo:

```text
Verb: depend

Error:
preposition

Expected:
depend on

Student:
depend of
```

Ou:

```text
Verb:
go

Problem:
Past tense

Expected:
went

Student:
goed
```

Ou:

```text
Problem:
sentence construction
```

Ou:

```text
Problem:
meaning/context
```

Ou:

```text
Problem:
pronunciation
```

Crie categorias de erro:

```text
meaning
grammar
tense
conjugation
preposition
collocation
sentence_structure
context
pronunciation
spelling
word_choice
other
```

Isso permitirá descobrir **por que** estou errando.

---

# 15. PROFESSOR MARCA A PRONÚNCIA

Não quero reconhecimento automático de voz.

O professor estará comigo presencialmente.

Durante uma atividade oral, o professor poderá marcar:

```text
✓ Pronúncia correta
✗ Pronúncia incorreta
```

Opcionalmente:

```text
Excelente
Boa
Precisa melhorar
Muito fraca
```

O sistema registra isso como dado de desempenho.

Por exemplo:

```text
Sentence:
I avoided the problem.

Pronunciation:
✓

Teacher evaluation:
Good
```

ou:

```text
Pronunciation:
✗

Problem:
final consonant
```

Isso deve afetar o domínio daquele item, mas **não deve ser confundido com erro gramatical**.

---

# 16. LEITURA EM VOZ ALTA

Embora não queira IA de voz, quero que o site tenha, se possível, uma função:

> 🔊 Ouvir pronúncia

Utilize recursos nativos do navegador quando forem suficientes, como a API de síntese de fala disponível no browser.

Não implemente reconhecimento de voz.

A função deverá permitir ouvir:

* palavra;
* frase;
* parágrafo.

Preferencialmente em inglês.

Exemplo:

```text
[🔊 Listen]
I avoided the problem.
```

Se a API do navegador não estiver disponível, o sistema deve continuar funcionando normalmente.

---

# 17. REPETIÇÃO INTERCALADA

Este é um dos elementos centrais.

Não quero estudar:

```text
VERBO A
VERBO A
VERBO A
VERBO A
```

até cansar.

Quero:

```text
A
A + B
A + B + C
B + C + D
A + C + D
```

Ou seja:

**novos conteúdos devem coexistir com conteúdos antigos.**

Um verbo aprendido recentemente deve continuar reaparecendo nas próximas sessões.

Especialmente:

> itens que apresentam erros devem reaparecer com maior frequência.

---

# 18. CICLOS DE ESTUDO

Crie uma tela de estudo baseada em sessões.

Uma sessão poderá conter:

### 1. Novas aquisições

Exemplo:

```text
3 novos verbos
```

### 2. Prática

Construção de frases.

### 3. Prática vocal

Professor marca pronúncia.

### 4. Revisões

Itens antigos.

### 5. Reforço

Itens com maior quantidade de erros.

A sessão deve ser dinâmica.

---

# 19. TELA PRINCIPAL / DASHBOARD

Crie um dashboard visual e limpo.

Quero visualizar rapidamente:

```text
┌────────────────────────────────────────────┐
│ ENGLISH STUDY DASHBOARD                   │
├────────────────────────────────────────────┤
│                                            │
│ Palavras aprendidas       247              │
│ Frases adquiridas         186              │
│ Verbos dominados           74              │
│ Revisões pendentes         31              │
│                                            │
├────────────────────────────────────────────┤
│ DOMÍNIO                                   │
│                                            │
│ 🟢 Excelente     62%                       │
│ 🟡 Médio         25%                       │
│ 🔴 Fraco         13%                       │
│                                            │
├────────────────────────────────────────────┤
│ REVISÕES PRIORITÁRIAS                     │
│                                            │
│ 1. conduct       🔴                        │
│ 2. depend        🔴                        │
│ 3. avoid         🟡                        │
│                                            │
├────────────────────────────────────────────┤
│ NOVAS AQUISIÇÕES                           │
│                                            │
│ + 3 itens                                  │
└────────────────────────────────────────────┘
```

Use verde, amarelo e vermelho de maneira consistente.

### Verde

Excelente domínio.

### Amarelo

Conhecimento parcial.

### Vermelho

Necessita reforço.

Não faça o dashboard parecer um sistema corporativo.

Quero algo moderno, simples e focado em estudo.

---

# 20. DASHBOARD MAIS DETALHADO

Além do resumo, permita visualizar:

### Vocabulário

```text
Total
Aprendidos
Em aprendizagem
Fracos
```

### Frases

```text
Total
Novas
Em revisão
Dominadas
```

### Verbos

```text
Total
Por nível
Por tempo verbal
Por domínio
```

### Revisões

```text
Hoje
Atrasadas
Próximas
Maior prioridade
```

### Erros

```text
Erros por categoria
Erros recentes
Itens com maior reincidência
```

---

# 21. GRÁFICOS

Utilize gráficos simples para mostrar evolução.

Exemplos:

```text
Vocabulário aprendido por semana
```

```text
Taxa de acerto ao longo do tempo
```

```text
Erros por categoria
```

```text
Itens dominados por nível
```

Não exagere nos gráficos.

A informação mais importante deve continuar sendo:

> o que preciso estudar agora?

---

# 22. TELA "ESTUDAR AGORA"

Essa será uma das telas mais importantes.

Ao clicar:

> **Estudar agora**

o sistema calcula quais itens devem aparecer.

A ordem deverá considerar:

1. revisões atrasadas;
2. itens com muitos erros;
3. itens recentemente aprendidos;
4. itens que precisam de reforço;
5. repetição intercalada;
6. novas aquisições.

Não mostrar simplesmente uma lista aleatória.

---

# 23. CARTÃO DE REVISÃO

Crie uma interface semelhante a um flashcard moderno.

Exemplo:

```text
┌──────────────────────────────┐
│                              │
│           AVOID              │
│                              │
│        🔊 Listen             │
│                              │
│  What does this verb mean?   │
│                              │
│        [Show answer]         │
│                              │
└──────────────────────────────┘
```

Depois:

```text
Meaning:
evitar

Context:
problems / people / situations

Example:
I avoid unnecessary conflict.
```

E então:

```text
How did you perform?

🔴 Hard
🟡 Partial
🟢 Easy
```

Mas também quero poder registrar especificamente:

```text
Meaning ✓
Grammar ✓
Sentence ✓
Pronunciation ✓
```

ou marcar cada um como erro.

---

# 24. FRASES PRODUZIDAS PELO ALUNO

Preciso conseguir escrever minha própria frase.

Exemplo:

```text
Use "avoid" in a sentence:

[____________________________]

[Check / Record]
```

Não precisa existir correção automática por IA.

O professor poderá avaliar manualmente.

O sistema registra:

```text
Student sentence
Teacher result
Date
Verb
Context
Tense
Error categories
```

---

# 25. PROFESSOR COMO AVALIADOR

Crie uma interface simples para o professor marcar:

```text
✓ Correct
△ Partially correct
✗ Incorrect
```

E campos opcionais:

```text
Pronunciation
Grammar
Meaning
Naturalness
Vocabulary
```

O professor pode adicionar uma observação curta.

Exemplo:

```text
"Good sentence, but use 'depend on', not 'depend of'."
```

---

# 26. FRASES DEVEM VIRAR CONTEÚDO DE REVISÃO

Quando uma frase for considerada aprendida, ela não deve desaparecer.

Ela passa a integrar o banco de frases.

Assim:

```text
Vocabulary
   ↓
Sentence
   ↓
Practice
   ↓
Review
   ↓
Mastery
```

O sistema deverá registrar novas frases aprendidas ao longo do tempo.

---

# 27. CONTEXTO

Uma mesma palavra poderá possuir vários contextos.

Exemplo:

```text
RUN

Context 1:
physical movement

Context 2:
operating a machine

Context 3:
managing a business

Context 4:
encountering someone
```

Cada contexto pode possuir frases diferentes.

Isso é importante porque o objetivo é:

> aprender a palavra em múltiplos contextos.

Não considere que dominar um único significado equivale a dominar completamente o item.

---

# 28. DOMÍNIO POR CONTEXTO

Sempre que possível, permita:

```text
avoid
├── avoid people      🟢
├── avoid problems    🟢
├── avoid doing       🟡
└── avoid conflict    🔴
```

Isso será muito mais útil que um único número global.

---

# 29. DOMÍNIO POR TEMPO VERBAL

Também:

```text
RUN

Present Simple       🟢
Past Simple          🟢
Present Continuous   🟡
Present Perfect      🔴
Conditional          🔴
```

Isso deve permitir descobrir:

> "Eu conheço o verbo, mas ainda não consigo usá-lo no Present Perfect."

---

# 30. BANCO DE DADOS

Utilize PostgreSQL como banco principal se ele estiver disponível.

Como PostgreSQL e MySQL já estão instalados na máquina, não instale outro servidor de banco sem necessidade.

Antes de implementar:

1. detecte qual está funcionando;
2. verifique versões;
3. verifique como o banco local está configurado;
4. prefira PostgreSQL;
5. caso exista alguma dificuldade real com PostgreSQL, documente a alternativa.

Crie migrations/schema para que o projeto possa ser recriado.

Não dependa de dados inseridos manualmente no banco.

---

# 31. MODELO DE DADOS

Estruture o banco para comportar pelo menos:

```text
students
vocabulary_items
verb_forms
meanings
contexts
sentences
paragraphs
study_sessions
reviews
review_results
errors
pronunciation_practice
grammar_practice
tense_practice
student_progress
```

Adapte os nomes conforme sua arquitetura.

Não crie tabelas desnecessárias.

Mantenha relacionamentos claros.

---

# 32. LISTA DE ESTUDANTES

Não preciso de login.

Porém, quero uma lista local de estudantes.

Isso servirá para permitir que futuramente outras pessoas utilizem a aplicação.

A tela inicial poderá ser:

```text
Select Student

[Filipe]
[Student 2]
[Student 3]

+ Add Student
```

Cada estudante deverá possuir:

```text
name
current_level
created_at
```

e seus próprios dados de aprendizagem.

Não implemente autenticação.

---

# 33. NÍVEL DO ESTUDANTE

Permita definir:

```text
A1
A2
B1
B2
C1
```

O dashboard deverá mostrar:

```text
Current level: B1
```

Mas deixe claro na interface que esse nível é um **nível de estudo cadastrado**, e não uma certificação oficial.

---

# 34. HISTÓRICO

Cada revisão deve gerar um registro.

Exemplo:

```text
verb: avoid
date: 2026-09-30
result: correct
meaning: correct
grammar: correct
pronunciation: incorrect
context: correct
difficulty: medium
```

Isso permitirá reconstruir o histórico.

Não sobrescreva o histórico anterior.

---

# 35. AUDITORIA DO ALGORITMO

Crie uma maneira de visualizar por que determinado item foi escolhido para revisão.

Por exemplo:

```text
Why is "depend" here?

6 previous errors
Last error: yesterday
Pronunciation weak
Review overdue
Priority: 87
```

Isso é muito importante.

Quero conseguir entender o comportamento do sistema.

---

# 36. SISTEMA DE RECOMENDAÇÃO SEM IA

Você pode criar algoritmos determinísticos para ajudar o estudante.

Por exemplo:

```text
"If a verb has many errors in Past Simple,
increase its Past Simple review frequency."

"If pronunciation repeatedly fails,
schedule pronunciation practice."

"If a context is mastered but another context is weak,
prioritize the weak context."
```

Isso **não é IA generativa**.

É apenas lógica de aplicação baseada nos dados do estudante.

Implemente isso.

---

# 37. SELEÇÃO MANUAL

Além do algoritmo automático, preciso poder escolher:

```text
Study this verb
```

Então, se eu clicar em:

```text
avoid
```

o sistema deverá abrir uma sessão específica daquele verbo.

Também:

```text
Study weak items
```

```text
Study today's reviews
```

```text
Study new vocabulary
```

```text
Study pronunciation
```

---

# 38. PESQUISA

Adicione busca por:

* palavra;
* verbo;
* frase;
* nível;
* classe gramatical;
* contexto;
* status.

Exemplo:

```text
Search: avoid
```

Resultado:

```text
avoid
Verb
B1
7 contexts
14 sentences
Accuracy: 82%
Status: 🟡
```

---

# 39. TELA DO VERBO

Ao abrir um verbo, quero algo parecido com:

```text
AVOID
B1
🟡 Intermediate

Meaning:
evitar

Contexts:
• people
• problems
• situations
• doing something

Tenses:
Present Simple       🟢
Past Simple          🟢
Present Continuous   🟡
Present Perfect      🔴

Sentences:
14

Reviews:
27

Errors:
5

Pronunciation:
🟢

[Study this verb]
```

---

# 40. DESIGN

Crie uma interface moderna, limpa e confortável para estudo prolongado.

Prioridades:

* legibilidade;
* pouco ruído visual;
* boa hierarquia;
* navegação rápida;
* cards;
* indicadores de progresso;
* cores consistentes;
* responsividade.

Use:

🟢 verde = excelente

🟡 amarelo = intermediário

🔴 vermelho = fraco

Não utilize essas cores apenas como decoração.

Elas precisam possuir significado semântico consistente.

---

# 41. RESPONSIVIDADE

A aplicação deve funcionar em:

* desktop;
* notebook;
* tablet;
* celular.

Meu uso principal será no computador.

Priorize desktop, mas não quebre telas menores.

---

# 42. ARQUITETURA

Use uma arquitetura simples e sustentável.

Frontend:

```text
React
```

Backend:

```text
API local
```

Banco:

```text
PostgreSQL
```

Não complique a infraestrutura sem necessidade.

Evite adicionar dezenas de dependências.

Prefira bibliotecas maduras e simples.

---

# 43. CONFIGURAÇÃO LOCAL

Antes de finalizar, inspecione minha máquina.

Verifique:

```text
Node.js
npm
PostgreSQL
psql
Git
```

e qualquer outra dependência realmente necessária.

**Não assuma que eu preciso instalar algo que já esteja instalado.**

Também não assuma versões.

Descubra as versões disponíveis.

---

# 44. INSTRUÇÕES DE EXECUÇÃO

No final da implementação, crie um arquivo:

```text
README.md
```

com instruções específicas para minha máquina.

Quero comandos reais, por exemplo:

```powershell
cd caminho-do-projeto

npm install

createdb english_study

npm run migrate

npm run dev
```

Mas **não copie esses comandos cegamente**.

Primeiro descubra a estrutura real do projeto, os scripts existentes e a configuração real do PostgreSQL.

Explique exatamente:

1. como criar/configurar o banco;
2. como configurar `.env`;
3. como executar migrations;
4. como iniciar backend;
5. como iniciar frontend;
6. qual endereço abrir no navegador;
7. como parar o servidor;
8. como reiniciar;
9. como limpar/recriar o banco, se necessário.

Como minha máquina é Windows, forneça preferencialmente comandos compatíveis com PowerShell/CMD quando isso fizer sentido.

Se o projeto exigir dois terminais, deixe isso explicitamente indicado:

```text
TERMINAL 1
...

TERMINAL 2
...
```

---

# 45. ARQUIVO `.env`

Crie:

```text
.env.example
```

Nunca coloque credenciais reais no código.

Explique onde devo inserir:

```text
DATABASE_URL
```

e outras variáveis necessárias.

---

# 46. DADOS INICIAIS

Crie seed inicial para facilitar testes.

Inclua alguns exemplos como:

```text
avoid
run
make
take
depend
deal
```

e algumas frases.

Não precisa criar centenas de palavras.

O objetivo é permitir testar imediatamente:

* dashboard;
* revisão;
* erros;
* níveis;
* frases;
* tempos verbais;
* pronúncia;
* repetição espaçada.

---

# 47. TESTES

Crie testes para as partes mais importantes.

Principalmente:

### Algoritmo de revisão

Testar:

```text
acerto → intervalo aumenta
erro → intervalo diminui
erros recorrentes → prioridade aumenta
item atrasado → prioridade aumenta
```

### Banco

Testar relacionamentos principais.

### Interface

Testar pelo menos os fluxos principais:

```text
selecionar estudante
→ estudar
→ responder
→ registrar resultado
→ recalcular prioridade
→ retornar ao dashboard
```

---

# 48. NÃO FAÇA UMA DEMONSTRAÇÃO ESTÁTICA

Não quero apenas uma interface bonita com dados falsos.

Quero uma aplicação funcional.

Quando eu:

```text
clicar
```

deve funcionar.

Quando eu:

```text
registrar um erro
```

o banco deve armazenar.

Quando eu:

```text
revisar novamente
```

o algoritmo deve considerar o histórico.

Quando eu:

```text
adicionar uma frase
```

ela deve aparecer posteriormente.

Quando eu:

```text
marcar pronúncia como incorreta
```

isso deve afetar os dados de desempenho.

---

# 49. FLUXO COMPLETO ESPERADO

O sistema deve permitir este fluxo:

```text
Selecionar estudante
        ↓
Dashboard
        ↓
Estudar agora
        ↓
Sistema calcula prioridades
        ↓
Apresenta revisão
        ↓
Aluno responde
        ↓
Professor avalia quando necessário
        ↓
Resultado é registrado
        ↓
Erros são classificados
        ↓
Algoritmo recalcula domínio
        ↓
Próxima revisão é calculada
        ↓
Dashboard atualizado
```

E também:

```text
Adicionar novo verbo
        ↓
Definir nível
        ↓
Registrar significado
        ↓
Adicionar contexto
        ↓
Criar primeira frase
        ↓
Praticar
        ↓
Registrar resultado
        ↓
Entrar no sistema de repetição
```

---

# 50. REGRA PEDAGÓGICA CENTRAL

O sistema deve obedecer a este princípio:

> **Aprender pouco → praticar → errar → corrigir → repetir → intercalar → ampliar contexto → dominar.**

Não quero um sistema que simplesmente conte palavras.

Quero um sistema que acompanhe:

> **o que eu sei, o que eu quase sei, o que eu esqueço e exatamente onde estou errando.**

---

# 51. PRINCÍPIO MAIS IMPORTANTE DO ALGORITMO

Não trate:

```text
"Eu conheço esta palavra"
```

como equivalente a:

```text
"Eu domino esta palavra."
```

O domínio deverá depender de evidências de uso.

Um verbo poderá estar:

```text
🟢 significado
🟢 Present Simple
🟡 Past Simple
🔴 Present Perfect
🟢 contexto cotidiano
🔴 contexto profissional
🟡 pronúncia
```

O sistema deve refletir essa diferença.

---

# 52. RESULTADO FINAL ESPERADO

Ao terminar, entregue:

### 1. Aplicação funcionando

Frontend + backend + PostgreSQL.

### 2. Banco configurado

Com migrations e seed.

### 3. Dashboard

Com:

* palavras;
* verbos;
* frases;
* revisões;
* erros;
* progresso;
* níveis.

### 4. Sistema de estudo

Com:

* aquisição;
* prática;
* revisão;
* repetição intercalada;
* prioridade por erro.

### 5. Sistema de frases

Com registro e histórico.

### 6. Sistema de pronúncia manual

Com avaliação do professor.

### 7. Leitura em voz alta

Utilizando recursos nativos do navegador quando disponíveis.

### 8. Página individual do verbo

Com contextos, tempos verbais, frases e domínio.

### 9. Lista de estudantes

Sem autenticação.

### 10. README

Com instruções específicas para executar tudo localmente.

---

# 53. FORMA DE TRABALHO

Não tente implementar tudo cegamente em uma única etapa.

Trabalhe em fases:

## FASE 1

Inspecionar projeto e skills.

## FASE 2

Inspecionar ambiente da máquina.

## FASE 3

Projetar banco e arquitetura.

## FASE 4

Implementar backend e banco.

## FASE 5

Implementar frontend.

## FASE 6

Implementar sistema de estudo.

## FASE 7

Implementar algoritmo de repetição.

## FASE 8

Implementar dashboard.

## FASE 9

Implementar leitura em voz alta.

## FASE 10

Testar o fluxo completo.

## FASE 11

Corrigir problemas.

## FASE 12

Documentar execução local.

---

# 54. IMPORTANTE SOBRE A SKILL

A skill localizada em:

```text
/skills/skill.md
```

deve ser tratada como a especificação do comportamento do professor/exercício.

Leia-a integralmente antes de implementar as partes relacionadas ao treinamento.

Se houver:

```text
/skills/skill2/
```

ou outras skills relacionadas ao ensino de idiomas, leia-as também e utilize suas instruções para orientar a arquitetura da sessão de estudos.

A aplicação não precisa implementar a IA descrita pela skill.

Ela precisa fornecer o **ambiente de armazenamento, acompanhamento, revisão e análise necessário para que aquela metodologia funcione**.

---

# 55. NÃO INVENTE FUNCIONALIDADES DESNECESSÁRIAS

Não adicione:

* login;
* pagamentos;
* usuários online;
* chat;
* servidor externo;
* sistema social;
* ranking;
* publicidade;
* integração com serviços pagos;
* reconhecimento de voz por IA;
* geração automática de conteúdo por IA.

Se alguma funcionalidade não for necessária para o objetivo central, mantenha-a fora da primeira versão.

---

# 56. PRIMEIRA VERSÃO DEVE SER REALMENTE UTILIZÁVEL

Ao finalizar, eu quero conseguir fazer isto:

```text
abrir localhost
→ escolher meu estudante
→ ver meu progresso
→ clicar em "Estudar agora"
→ receber uma revisão
→ responder
→ registrar acerto/erro
→ registrar pronúncia
→ salvar uma frase
→ estudar um verbo específico
→ revisar novamente
→ observar o dashboard mudar
```

Se esse fluxo funcionar de ponta a ponta, a primeira versão estará cumprindo seu objetivo.

---

# 57. ANTES DE DIZER QUE TERMINOU

Faça uma verificação final.

Confirme que:

* [ ] frontend inicia;
* [ ] backend inicia;
* [ ] PostgreSQL conecta;
* [ ] migrations funcionam;
* [ ] seed funciona;
* [ ] estudante pode ser selecionado;
* [ ] novo verbo pode ser criado;
* [ ] frase pode ser criada;
* [ ] revisão pode ser realizada;
* [ ] resultado é persistido;
* [ ] erro altera prioridade;
* [ ] repetição espaçada funciona;
* [ ] pronúncia pode ser registrada manualmente;
* [ ] texto pode ser reproduzido por TTS do navegador;
* [ ] dashboard reflete os dados reais;
* [ ] busca funciona;
* [ ] níveis funcionam;
* [ ] histórico funciona;
* [ ] nenhum recurso depende de uma API de IA externa.

Se encontrar problemas, corrija-os antes de considerar a implementação concluída.

No final, informe claramente:

1. o que foi implementado;
2. quais arquivos principais foram criados/modificados;
3. qual banco foi utilizado;
4. quais dependências foram detectadas;
5. quais comandos devo executar;
6. qual endereço devo abrir no navegador;
7. como iniciar novamente o projeto no futuro;
8. eventuais limitações da primeira versão.

**Não apenas descreva como fazer. Faça a implementação no projeto.**
