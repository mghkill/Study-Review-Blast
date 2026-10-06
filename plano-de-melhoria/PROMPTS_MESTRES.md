# Catálogo Mestre de Prompts (PROMPTS_MESTRES.md)

Este é o ÚNICO arquivo de prompts que você precisa consultar para o desenvolvimento guiado por IA deste projeto. Basta ler o título do que deseja, copiar o bloco correspondente com um clique e colar no chat.

## 1. Atualizar Documentação (README)
```text
Ative a skill gerador-de-m. Minha solicitação é: Atualizar o README do projeto com as últimas novidades.
```

## 2. Continuar a Programação Diária
```text
Ative a skill gerador-de-m. Minha solicitação é: Continuar a programação (executar a próxima T-xx operacional pendente).
```

## 3. Executar Próxima Melhoria de Planejamento
```text
Ative a skill gerador-de-m. Minha solicitação é: Executar a próxima melhoria planejada na fila do plano-de-melhoria.
```

## 4. Limpeza Segura (Arquivos antigos)
```text
Ative a skill gerador-de-m. Minha solicitação é: Limpar os arquivos de prompt antigos do projeto e arquivá-los no legado.
```

## 5. Criar uma Nova Skill
```text
Ative a skill gerador-de-m. Minha solicitação é: Criar uma nova skill permanente para automatizar a tarefa X.
```

## 6. Correção de Bugs
```text
Ative a skill gerador-de-m. Minha solicitação é: Corrigir o bug X que encontrei na rota Y.
```

## 7. Padronização Global de Idioma
```text
Ative a skill gerador-de-m. Minha solicitação é: Garantir a padronização 100% inglês em todos os comentários e pastas.
```

## 8. Renomear/Reorganizar Arquivos
```text
Ative a skill gerador-de-m. Minha solicitação é: Renomear arquivos de documentação para inglês estruturadamente.
```

---

> **Como a IA sabe qual skill usar?**
> A skill `gerador-de-m` é inteligente. Quando você faz um pedido, ela primeiro vasculha a pasta `.agents/skills/` para ver se já temos uma skill que resolva isso (como a `readme-open-source`). Se não existir, ela mesma propõe a criação de uma **nova skill** na tarefa M que ela vai gerar para você aprovar.

---

## Regra de Segurança do Projeto
Para proteger o seu progresso contra alucinações e perda de contexto: todo prompt acima primeiro criará uma tarefa formal (um cartão **M**) no arquivo `MELHORIA-PLANO.md`. A IA pedirá sua aprovação antes de executar, detalhando qual skill usará e o que fará.
