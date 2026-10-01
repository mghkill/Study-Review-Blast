# Checklist de projeto open source

Use para decidir o que o repositório já tem e o que falta. Só crie arquivos com a aprovação do usuário.

## Arquivos na raiz

| Arquivo | Obrigatório | Função |
|---|---|---|
| `README.md` | Sim | Vitrine e manual de entrada |
| `LICENSE` | Sim | Sem licença, o código é "todos os direitos reservados" e ninguém pode usar legalmente |
| `CONTRIBUTING.md` | Recomendado | Como configurar o ambiente, padrões de código, fluxo de PR |
| `CODE_OF_CONDUCT.md` | Recomendado | Regras de convivência (Contributor Covenant) |
| `SECURITY.md` | Recomendado | Como reportar vulnerabilidades com privacidade |
| `CHANGELOG.md` | Recomendado | Histórico por versão (Keep a Changelog + SemVer) |
| `.env.example` | Se usa variáveis | Documenta configuração sem segredos |
| `.gitignore` | Sim | Evita versionar `node_modules`, `.env`, builds |
| `.github/ISSUE_TEMPLATE/` | Recomendado | Modelos de bug e feature |
| `.github/PULL_REQUEST_TEMPLATE.md` | Recomendado | Checklist de PR |
| `.github/workflows/` | Recomendado | CI: lint, testes, build |

## Escolha de licença (apresentar, nunca decidir sozinho)

- **MIT**: permissiva e curta. Qualquer um pode usar, inclusive em código fechado, mantendo o aviso de copyright.
- **Apache-2.0**: permissiva, com concessão explícita de patentes. Boa para projetos maiores e empresariais.
- **GPL-3.0**: copyleft forte. Trabalhos derivados distribuídos precisam continuar abertos.
- **AGPL-3.0**: como a GPL, mas cobre também uso via rede (SaaS).
- **Sem licença / proprietária**: use apenas se o código não deve ser reutilizado; nesse caso o README não deve usar o selo "open source".

## Modelo curto de SECURITY.md

```markdown
# Política de segurança

## Versões suportadas
| Versão | Suporte |
|---|---|
| <x.y.z> | Sim |

## Reportando uma vulnerabilidade
Não abra uma issue pública. Envie um e-mail para <contato> ou use o
"Report a vulnerability" da aba Security do GitHub. Respondemos em até <prazo>.
```

## Modelo de seções do CONTRIBUTING.md

1. Como reportar bugs (o que incluir: passos, versão, logs)
2. Como sugerir funcionalidades
3. Configuração do ambiente (remeter ao README)
4. Padrão de código, lint e formatação
5. Convenção de branches e commits
6. Como rodar os testes
7. Processo de revisão do PR e prazos esperados

## Badges: regras

- Máximo de 6 a 8, só os que informam algo verificável.
- Licença, versão/release, status do CI, cobertura e PRs bem-vindos são os essenciais.
- Nunca inclua badge de serviço que não está configurado (aparece quebrado ou "unknown").
- Gere em shields.io; use URL-encode para acentos (`licen%C3%A7a`).

## Versionamento

- Versões semânticas (MAJOR.MINOR.PATCH) com tags e releases no GitHub.
- Changelog no formato Keep a Changelog; links de comparação entre versões.

## Tópicos e descrição do repositório

No GitHub, preencha a descrição curta (igual à tagline), o site e os *topics* (5 a 10 palavras-chave) para facilitar a descoberta.
