# Catálogo Mestre de Prompts (PROMPTS_MESTRES.md)

Este é o ÚNICO arquivo de prompts que você precisa consultar para governar este projeto. Cada prompt aciona automações específicas (Skills) que garantem a segurança e a evolução da arquitetura.

---

## 0. Inicialização de Contexto Profundo
**Skill Relacionada:** `brain-sync`
**Como Funciona:** Força a IA a ler as regras inegociáveis, o histórico e o catálogo de skills antes de iniciar qualquer trabalho pesado. Isso "traz a IA para a realidade" do projeto.
**Variações de Uso:**
- *Início de dia (Padrão):* "Carregue seu contexto profundo lendo as regras globais..."
- *Resolução de conflito:* "...e avalie se a nossa última alteração violou alguma regra global descrita no RELATORIO-GERAL."
**Prompt Padrão:**
```text
Ative a skill brain-sync. Minha solicitação é: Carregue seu contexto profundo lendo as regras globais, o catálogo de skills, o prompt mestre e o estado do projeto para se alinhar completamente à minha linha de raciocínio antes de começarmos a trabalhar.
```

## 1. Execução Operacional de Código (Tarefas T)
**Skill Relacionada:** `studyreviewblast-planner`
**Como Funciona:** Aciona a skill responsável por gerenciar o ciclo de desenvolvimento das tarefas operacionais do código da aplicação (T-001, T-002...), aplicando testes primeiro (TDD), pausas e commits lógicos.
**Variações de Uso:**
- *Sequencial (Padrão):* "Execute a próxima T-xx operacional pendente."
- *Cirúrgica:* "Leia o RETOMAR.md e execute apenas a parte do Frontend da T-005."
**Prompt Padrão:**
```text
Ative a skill studyreviewblast-planner. Minha solicitação é: Continuar a programação (executar a próxima T-xx pendente na fila operacional).
```

## 2. Refinamento de Planejamento e Gestão de Tokens (Tarefas M)
**Skill Relacionada:** `gerador-de-m`
**Como Funciona:** Delega à IA a responsabilidade de auditar o projeto, reorganizar prioridades e planejar melhorias estruturais *sem tocar no código fonte*. Possui inteligência de **Task Sizing**: se uma tarefa modificar muitos arquivos (>3-4), a IA alertará sobre o risco de estouro de token e sugerirá um "Split" (distribuição) em tarefas menores. Garante que segurança sempre tenha prioridade.
**Variações de Uso:**
- *Fila de Melhorias (Padrão):* "Execute a próxima melhoria planejada na fila."
- *Planejamento e Split:* "Gere um cartão M para refatorar o backend. Se for grande demais, faça o split em vários Ms."
- *Repriorização:* "Varra as pendências abertas e reorganize a fila dando prioridade para itens de segurança e estabilidade."
**Prompt Padrão:**
```text
Ative a skill gerador-de-m. Minha solicitação é: Executar a próxima melhoria planejada na fila do plano-de-melhoria, aplicando as regras de Task Sizing, Split (se necessário) e prioridade de Segurança.
```

## 3. Buscador de Contexto (Project Oracle)
**Skill Relacionada:** `project-oracle`
**Como Funciona:** Quando você está perdido, esta skill obriga a IA a vasculhar os logs e documentos mestre antes de te dar um status. Evita completamente que a IA minta ou tenha alucinações.
**Variações de Uso:**
- *Resumo Geral (Padrão):* "Buscar nos logs o que foi feito nas últimas horas e me dar um resumo."
- *Auditoria de Decisões:* "Me explique qual foi a Decisão D-08 e em que momento da Linha do Tempo ela foi tomada."
**Prompt Padrão:**
```text
Ative a skill project-oracle. Minha solicitação é: Buscar nos logs o que foi feito nas últimas horas e me dar um resumo exato do estado atual do projeto.
```

## 4. Atualizar Documentação Pública (README)
**Skill Relacionada:** `readme-open-source`
**Como Funciona:** Varre o ecossistema atual do repositório (skills ativas, versões de dependências, arquitetura) e gera um `README.md` de altíssimo nível, padrão open-source.
**Variações de Uso:**
- *Atualização Padrão:* "Atualizar o README do projeto."
- *Foco Específico:* "Revise apenas a seção de como rodar o projeto localmente no README para garantir que os comandos estão corretos."
**Prompt Padrão:**
```text
Ative a skill readme-open-source. Minha solicitação é: Atualizar o README do projeto com a arquitetura atualizada de agentes e tecnologias.
```

## 5. Curar Links e Referências (Markdown Doctor)
**Skill Relacionada:** `markdown-doctor`
**Como Funciona:** Varre todos os arquivos `.md` procurando links ou referências a arquivos que foram movidos ou deletados, e os conserta. Contém regra de verificação (look-ahead) para não consertar links que ainda vão ser deletados por uma faxina pendente.
**Variações de Uso:**
- *Auditoria Padrão:* "Varrer o projeto e consertar links quebrados nas documentações."
- *Pós-Reestruturação:* "Acabei de renomear a pasta plano-de-acao para docs. Atualize todas as referências cruzadas."
**Prompt Padrão:**
```text
Ative a skill markdown-doctor. Minha solicitação é: Varrer os arquivos markdown do projeto e curar quaisquer links e referências que estejam quebrados ou desatualizados.
```

## 6. Faxina Segura de Arquivos Obsoletos
**Skill Relacionada:** `safe-cleanup`
**Como Funciona:** Uma lixeira inteligente. Exige que a IA prove por que o arquivo é inútil antes de mandá-lo para a pasta de histórico (`legado/`) ou apagá-lo.
**Variações de Uso:**
- *Limpeza de alvo fixo:* "Limpar os arquivos X e Y."
- *Investigação:* "Verifique se a pasta raiz possui arquivos `.md` obsoletos e proponha uma faxina segura."
**Prompt Padrão:**
```text
Ative a skill safe-cleanup. Minha solicitação é: Encontrar arquivos obsoletos na pasta raiz e arquivá-los no legado seguindo as regras de segurança.
```

## 7. Sincronização Hierárquica em Cascata
**Skill Relacionada:** `hierarchy-sync`
**Como Funciona:** Garante que qualquer alteração arquitetural flua na ordem correta: do Log (baixo) -> Relatório (meio) -> README (topo), sem causar assimetria de informações.
**Variações de Uso:**
- *Sincronia Total (Padrão):* "Atualizar os documentos seguindo a cascata hierárquica."
- *Recalibragem:* "O README parece defasado do Relatório Geral. Force uma sincronização de baixo para cima."
**Prompt Padrão:**
```text
Ative a skill hierarchy-sync. Minha solicitação é: Atualizar os relatórios e documentos do projeto seguindo a cascata hierárquica oficial, garantindo que nada fique defasado.
```

## 8. Recuperação de Pane (Crash Recovery)
**Skill Relacionada:** `crash-recovery`
**Como Funciona:** Seu salva-vidas para quedas de energia, internet, limite de token estourado ou fechamento acidental da janela.
**Variações de Uso:**
- *Crash de Sistema (Padrão):* "O sistema caiu. Onde estávamos?"
- *Troca de IA:* "Uma outra IA estava trabalhando e parou no meio. Descubra em qual arquivo ela parou lendo o git status e a linha do tempo."
**Prompt Padrão:**
```text
Ative a skill crash-recovery. Minha solicitação é: O sistema caiu na última sessão. Descubra onde estávamos e me explique qual é o próximo passo para retomarmos sem perder nada.
```

## 9. Criar ou Atualizar uma Nova Skill
**Skills Relacionadas:** `gerador-de-m` em união com `prompt-updater`
**Como Funciona:** Aciona o planejador estrutural para desenhar uma nova inteligência permanente para o projeto e, ao concluir, garantir que o prompt correspondente seja registrado neste catálogo.
**Variações de Uso:**
- *Criação Padrão:* "Criar skill para automatizar deploy."
- *Atualização de Regra:* "Adicione a lógica X na skill Y e use o prompt-updater para alinhar a documentação."
**Prompt Padrão:**
```text
Ative a skill gerador-de-m. Minha solicitação é: Criar uma nova skill permanente para automatizar [SUA IDEIA] e, em seguida, gerar o cartão para que o prompt-updater registre ela aqui no catálogo.
```

---

## 10. Varredura de Segurança do Backend
**Skill Relacionada:** `security-scanner`
**Como Funciona:** Executa uma bateria de 7 verificações estáticas no código-fonte do servidor (`server/src/`) baseadas nas regras globais de segurança (§3). Detecta interpolações SQL perigosas, vazamento de `err.message`, credenciais em logs, ausência de `helmet`/rate-limit e rotas destrutivas sem autenticação. Gera achados no formato `SEC-xx` e propõe cartões M para correção — **nunca altera código diretamente**.
**Variações de Uso:**
- *Varredura Completa (Padrão):* "Rodar a varredura de segurança no backend e me dar o relatório de achados."
- *Pós-Adição de Rota:* "Acabei de criar a rota `/api/tts`. Execute o security-scanner nela antes de commitar."
- *Auditoria Periódica:* "Início da Fase 6. Rode o security-scanner e confirme que não há regressões de segurança."
**Prompt Padrão:**
```text
Ative a skill security-scanner. Minha solicitação é: Varrer o backend (server/src/) com as verificações V-01 a V-07, gerar o relatório de achados SEC-xx e propor os cartões M correspondentes para correção.
```

---

> **Como a IA sabe qual skill usar?**
> A skill `gerador-de-m` possui um "Filtro de Autoconsciência". Quando você pede algo inédito, ela primeiro vasculha a pasta `.agents/skills/` para ver se já existe uma skill que resolva isso (evitando duplicidade). Se não existir, ela avalia se é um bug de 5 minutos ou uma demanda arquitetural que mereça a criação de uma **nova skill autônoma**.

