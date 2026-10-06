# Catálogo Mestre de Prompts (PROMPTS_MESTRES.md)

Este é o ÚNICO arquivo de prompts que você precisa consultar para governar este projeto. Cada prompt aciona automações específicas (Skills) que garantem a segurança e a evolução da arquitetura.

---

## 0. Brain Sync (Carregamento de Contexto Profundo)
**Skill Relacionada:** `brain-sync`
**Como Funciona:** Força a IA a ler as regras inegociáveis, o histórico e o catálogo de skills antes de iniciar qualquer trabalho pesado. Isso "traz a IA para a realidade" do projeto.
**Variações de Uso:**
- *Início de dia (Padrão):* "Carregue seu contexto profundo lendo as regras globais..."
- *Resolução de conflito:* "...e avalie se a nossa última alteração violou alguma regra global descrita no RELATORIO-GERAL."
**Prompt Padrão:**
```text
Ative a skill brain-sync. Minha solicitação é: Carregue seu contexto profundo lendo as regras globais, o catálogo de skills, o prompt mestre e o estado do projeto em [INSERIR ARQUIVOS AQUI, ex: plano-de-acao/RELATORIO-GERAL-PROJETO.md e plano-de-melhoria/MELHORIA-PLANO.md] para se alinhar completamente à minha linha de raciocínio antes de começarmos a trabalhar.
```

## 1. Planner de Tarefas (Executar T-Tasks de Código)
**Skill Relacionada:** `studyreviewblast-planner`
**Como Funciona:** Aciona a skill responsável por gerenciar o ciclo de desenvolvimento das tarefas operacionais do código da aplicação (T-001, T-002...), aplicando testes primeiro (TDD), pausas e commits lógicos.
**Variações de Uso:**
- *Sequencial (Padrão):* "Execute a próxima T-xx pendente."
- *Cirúrgica:* "Leia o RETOMAR.md e execute apenas a parte do Frontend da T-005."
**Prompt Padrão:**
```text
Ative a skill studyreviewblast-planner. Minha solicitação é: [INSERIR AÇÃO, ex: Continuar a programação executando a próxima tarefa T-xx pendente na fila operacional do TAREFAS.md, aplicando TDD e sugerindo os commits exatos no final].
```

## 2. Gerador de M (Planejar, Priorizar e Dividir Tarefas M)
**Skill Relacionada:** `gerador-de-m`
**Como Funciona:** Delega à IA a responsabilidade de auditar o projeto, reorganizar prioridades e planejar melhorias estruturais *sem tocar no código fonte*. Possui inteligência de **Task Sizing**: se uma tarefa modificar muitos arquivos (>3-4), a IA alertará sobre o risco de estouro de token e sugerirá um "Split" (distribuição) em tarefas menores. Garante que segurança sempre tenha prioridade.
**Variações de Uso:**
- *Fila de Melhorias (Padrão):* "Execute a próxima melhoria planejada na fila."
- *Execução de M Específico:* "Executar a M-41 gerando o rascunho com a nova priorização de segurança no projeto."
- *Planejamento e Split:* "Gere um cartão M para refatorar o backend. Se for grande demais, faça o split em vários Ms."
- *Repriorização:* "Varra as pendências abertas e reorganize a fila dando prioridade para segurança."
**Prompt Padrão:**
```text
Ative a skill gerador-de-m. Minha solicitação é: [INSERIR AÇÃO DE PLANEJAMENTO, ex: Avaliar o projeto e gerar o cartão M-XX para implementar X funcionalidade, aplicando regras de Task Sizing, Split se necessário e mantendo itens de segurança e estabilidade no topo da prioridade de execução].
```

## 3. Project Oracle (Buscar Histórico e Resumir Status)
**Skill Relacionada:** `project-oracle`
**Como Funciona:** Quando você está perdido, esta skill obriga a IA a vasculhar os logs e documentos mestre antes de te dar um status. Evita completamente que a IA minta ou tenha alucinações.
**Variações de Uso:**
- *Resumo Geral (Padrão):* "Buscar nos logs o que foi feito nas últimas horas e me dar um resumo."
- *Auditoria de Decisões:* "Me explique qual foi a Decisão D-08."
**Prompt Padrão:**
```text
Ative a skill project-oracle. Minha solicitação é: [INSERIR AÇÃO DE BUSCA, ex: Buscar nos logs do plano-de-melhoria o que foi feito nas últimas horas e me dar um resumo exato do estado atual do projeto, referenciando apenas fatos e documentos oficiais].
```

## 4. README Open Source (Atualizar Documentação Pública)
**Skill Relacionada:** `readme-open-source`
**Como Funciona:** Varre o ecossistema atual do repositório (skills ativas, versões de dependências, arquitetura) e gera um `README.md` de altíssimo nível, padrão open-source.
**Variações de Uso:**
- *Atualização Padrão:* "Atualizar o README do projeto."
- *Foco Específico:* "Revise apenas a seção de instalação no README."
**Prompt Padrão:**
```text
Ative a skill readme-open-source. Minha solicitação é: [INSERIR AÇÃO DO README, ex: Atualizar o README do projeto com a arquitetura atualizada, tecnologias recentes, badges apropriadas e as novas diretrizes do projeto em inglês e português].
```

## 5. Markdown Doctor (Curar Links e Referências Quebradas)
**Skill Relacionada:** `markdown-doctor`
**Como Funciona:** Varre todos os arquivos `.md` procurando links ou referências a arquivos que foram movidos ou deletados, e os conserta. Contém regra de verificação (look-ahead).
**Variações de Uso:**
- *Auditoria Padrão:* "Varrer o projeto e consertar links."
- *Pós-Reestruturação:* "Acabei de renomear a pasta X, conserte os links."
**Prompt Padrão:**
```text
Ative a skill markdown-doctor. Minha solicitação é: [INSERIR AÇÃO DE CURA, ex: Varrer todos os arquivos markdown do projeto e curar quaisquer links e referências cruzadas que estejam apontando para caminhos inexistentes ou desatualizados].
```

## 6. Safe Cleanup (Faxina Segura de Arquivos Obsoletos)
**Skill Relacionada:** `safe-cleanup`
**Como Funciona:** Uma lixeira inteligente. Exige que a IA prove por que o arquivo é inútil antes de mandá-lo para a pasta de histórico (`legado/`) ou apagá-lo.
**Variações de Uso:**
- *Limpeza de alvo fixo:* "Limpar os arquivos X e Y."
- *Investigação:* "Verifique se a pasta raiz possui arquivos obsoletos."
**Prompt Padrão:**
```text
Ative a skill safe-cleanup. Minha solicitação é: [INSERIR AÇÃO DE FAXINA, ex: Encontrar arquivos temporários ou de documentação obsoleta na raiz do projeto e movê-los com segurança para a pasta de histórico/legado, detalhando as razões antes de agir].
```

## 7. Hierarchy Sync (Sincronização em Cascata de Documentos)
**Skill Relacionada:** `hierarchy-sync`
**Como Funciona:** Garante que qualquer alteração flua na ordem correta: Log (baixo) -> Relatório (meio) -> README (topo), evitando assimetria de informações.
**Variações de Uso:**
- *Sincronia Total (Padrão):* "Atualizar os documentos seguindo a cascata."
**Prompt Padrão:**
```text
Ative a skill hierarchy-sync. Minha solicitação é: [INSERIR AÇÃO DE SINCRONIZAÇÃO, ex: Atualizar os relatórios globais do projeto seguindo a cascata hierárquica oficial, começando do fundo (LOGS) até o topo (README), garantindo consistência total].
```

## 8. Crash Recovery (Recuperação de Pane e Retomada de Sessão)
**Skill Relacionada:** `crash-recovery`
**Como Funciona:** Seu salva-vidas para quedas de energia, limite de tokens estourado ou perdas de sessão. Depende intrinsecamente da Regra Global §6 (Pré-Registro de Save State em LOG) para funcionar.
**Variações de Uso:**
- *Crash Padrão:* "O sistema caiu. Onde estávamos?"
- *Troca de IA:* "Uma IA parou no meio. Descubra onde."
**Prompt Padrão:**
```text
Ative a skill crash-recovery. Minha solicitação é: [INSERIR CONTEXTO DO CRASH, ex: Houve uma queda abrupta na última sessão. Identifique onde estávamos baseado no último SAVE-STATE registrado nos logs e me explique qual é o próximo passo exato para retomarmos sem perder histórico ou duplicar esforços].
```

## 9. Criação e Atualização de Skills Permanentes
**Skills Relacionadas:** `gerador-de-m` em união com `prompt-updater`
**Como Funciona:** Desenha uma nova inteligência permanente (ou atualiza) e garante que o prompt seja registrado.
**Variações de Uso:**
- *Criação Padrão:* "Criar skill para automatizar deploy."
- *Atualização:* "Atualize a skill X e use o updater."
**Prompt Padrão:**
```text
Ative a skill gerador-de-m. Minha solicitação é: [INSERIR IDEIA DA SKILL, ex: Criar uma nova skill permanente para automatizar XYZ no projeto. Após criar a skill, agende um cartão para que a skill prompt-updater adicione esse novo recurso no Catálogo Mestre de Prompts].
```

## 10. Security Scanner (Varredura de Segurança e Auditoria)
**Skill Relacionada:** `security-scanner`
**Como Funciona:** Executa uma bateria de 7 verificações estáticas (V-01 a V-07) em busca de vulnerabilidades recorrentes. Gera achados no formato SEC-xx e propõe cartões M — **nunca altera código diretamente**.
**Variações de Uso:**
- *Auditoria Completa:* "Rodar varredura de segurança."
- *Pós-Modificação:* "Execute na rota recém criada."
**Prompt Padrão:**
```text
Ative a skill security-scanner. Minha solicitação é: [INSERIR ESCOPO DA VARREDURA, ex: Varrer o backend em server/src/ com as verificações de segurança ativas, gerar o relatório de achados SEC-xx e apenas propor os cartões M correspondentes no MELHORIA-PLANO.md, sem alterar o código de aplicação].
```

---

> **Como a IA sabe qual skill usar?**
> A skill `gerador-de-m` possui um "Filtro de Autoconsciência". Quando você pede algo inédito, ela primeiro vasculha a pasta `.agents/skills/` para ver se já existe uma skill que resolva isso (evitando duplicidade). Se não existir, ela avalia se é um bug pontual ou uma demanda arquitetural que mereça a criação de uma **nova skill autônoma**.
