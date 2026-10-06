---
name: readme-open-source
description: Cria e mantém o README.md da raiz do projeto no formato profissional de projetos open source (objetivo, stack com versões, instalação, uso, contribuição, licença, badges). Use SEMPRE que o usuário mencionar README, README.md, documentação do projeto, "página do projeto", open source, badges, CONTRIBUTING, licença, ou pedir para melhorar/atualizar/padronizar a apresentação do repositório. Use também depois de mudanças relevantes (nova dependência, upgrade de versão, novo serviço, novo script, mudança de objetivo) para manter o README sincronizado, mesmo que o usuário não peça explicitamente.
---

# README open source profissional

Esta skill transforma o `README.md` da raiz em uma página de projeto open source completa, e o mantém **sempre atualizado** a partir do que o repositório realmente contém. O README é a "vitrine" e o manual de entrada: quem chega deve entender em 30 segundos *o que é*, *para quê serve*, *com o quê foi feito* e *como rodar*.

## Regra de ouro

Nada de informação inventada. Tudo no README vem de uma destas fontes: arquivos do repositório, a saída de `scripts/detect_stack.py`, ou o que o usuário disse. Se faltar um dado (ex.: nome do autor, URL do repositório, licença escolhida), **pergunte uma vez, de forma objetiva**, ou deixe um marcador `<!-- TODO: ... -->` e avise no resumo final. Nunca preencha versão, comando ou URL por suposição.

## Fluxo de trabalho

Execute sempre nesta ordem.

### 1. Diagnosticar o projeto
1. Leia o `README.md` atual (se existir) e preserve tudo que for correto e específico (objetivo, decisões, créditos, links). O README antigo é matéria-prima, não lixo.
2. Rode o detector de stack na raiz do projeto:
   ```bash
   python /caminho/da/skill/scripts/detect_stack.py .
   ```
   Ele lista linguagens, runtimes, frameworks, bancos/serviços (Docker) e **as versões declaradas**, com o arquivo de origem de cada uma.
3. Leia os arquivos que explicam o objetivo e o uso: `package.json`/`pyproject.toml` (campo `description`), scripts (`scripts`, `Makefile`), `.env.example`, `docker-compose.yml`, pasta `docs/`, estrutura de `src/` ou `app/`.
4. Verifique quais arquivos de comunidade existem: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.github/` (templates de issue/PR, workflows). Use `references/open-source-checklist.md`.

### 2. Definir o objetivo do projeto
Escreva o objetivo **com o que o projeto já tem hoje**, não com o que se pretende ter. Formato:
- **Tagline** (1 linha, até ~120 caracteres): o que é + para quem.
- **Descrição** (2 a 4 frases): o problema que resolve, a solução e o diferencial.
- **Funcionalidades atuais**: só o que já está implementado no código. Planejado vai em *Roadmap*, claramente separado.

### 3. Montar o README a partir do template
Use `assets/README.template.md` como esqueleto. Remova seções que não se aplicam (ex.: "API" em uma biblioteca de CLI), mas **não** remova as essenciais: título, descrição, stack com versões, instalação, uso, contribuição, licença.

Ordem recomendada das seções:
1. Título + logo (opcional) + badges
2. Tagline e descrição
3. Sumário (se o README passar de ~150 linhas)
4. Demonstração (screenshot/GIF/link do deploy)
5. Funcionalidades
6. **Tecnologias e versões** (tabela)
7. Pré-requisitos
8. Instalação
9. Configuração (variáveis de ambiente)
10. Uso (comandos reais, exemplos)
11. Estrutura do projeto
12. Testes e qualidade (lint, build, CI)
13. Roadmap
14. Contribuindo
15. Código de conduta e segurança
16. Licença
17. Autores e agradecimentos / contato

### 4. Tabela de tecnologias e versões
Esta é a seção mais cobrada. Regras:
- Uma linha por tecnologia/serviço: **Camada | Tecnologia | Versão | Papel**.
- Versão vem do arquivo de origem: lockfile (versão exata instalada) tem prioridade sobre o manifesto (faixa declarada). Se só houver faixa (`^14.2.0`), escreva a faixa e deixe claro que é a declarada.
- Inclua também **runtimes e serviços**: Node/Python/Go/PHP, gerenciador de pacotes, banco de dados, cache, filas, imagens Docker (com tag), CI.
- Agrupe por camada: Linguagem e runtime, Frontend, Backend, Banco de dados e serviços, Infraestrutura e DevOps, Qualidade (lint, testes, formatação).
- Não liste dependências transitivas nem dezenas de utilitários; liste as que definem a arquitetura (framework, ORM, UI kit, auth, testes, build).

### 5. Instalação e uso verificáveis
- Os comandos precisam existir de fato (`scripts` do `package.json`, `Makefile`, `docker compose`). Copie-os, não os invente.
- Mostre o caminho feliz completo: clonar → instalar → configurar `.env` → rodar → abrir em `http://localhost:PORTA` (a porta vem do código/compose).
- Se houver Docker, ofereça as duas rotas (local e Docker) quando ambas existirem.
- Documente toda variável de `.env.example` em uma tabela: **Variável | Obrigatória | Descrição | Exemplo**. Nunca coloque segredos reais.

### 6. Padrão open source
Aplique `references/open-source-checklist.md`. Em resumo:
- **Licença** declarada no README e arquivo `LICENSE` na raiz. Se não existir, não escolha por conta própria: apresente as opções (MIT, Apache-2.0, GPL-3.0, AGPL-3.0) com uma frase sobre cada e pergunte.
- **CONTRIBUTING.md**, **CODE_OF_CONDUCT.md** (Contributor Covenant) e **SECURITY.md** referenciados no README. Se não existirem, ofereça criá-los; crie somente se o usuário aceitar.
- **Badges** reais e úteis (máximo 6 a 8): licença, versão, build/CI, cobertura, versão do runtime, PRs welcome. Só inclua badge de CI/cobertura se o serviço realmente estiver configurado.
- Convenção de commits e de branches, se o projeto usar (ex.: Conventional Commits).

### 7. Escrever bem
- Idioma do README = idioma principal do público do projeto. Se o projeto for brasileiro e o usuário escreve em português, use português; se o público for internacional, ofereça um `README.en.md` e link cruzado no topo.
- Frases curtas, voz ativa, blocos de código com a linguagem indicada (```bash).
- Links relativos para arquivos do repositório (`./LICENSE`, `./CONTRIBUTING.md`).
- Imagens com texto alternativo. Sem imagens quebradas: se não houver screenshot, omita a seção em vez de deixar placeholder.
- Evite adjetivos de marketing ("incrível", "poderoso"). Prefira fatos.

### 8. Manter sempre atualizado
Ao final de **qualquer** tarefa que altere o projeto, compare o README com o estado real e atualize se houver divergência. Gatilhos:
- dependência adicionada, removida ou com versão alterada (rode o detector de novo);
- novo serviço no `docker-compose.yml` ou nova variável no `.env.example`;
- novo script, comando ou porta;
- funcionalidade entregue (mover de *Roadmap* para *Funcionalidades*);
- mudança de licença, nome ou objetivo.

Para atualizações pequenas, edite só a seção afetada em vez de reescrever tudo. Se o README tiver o bloco `<!-- stack:start -->` … `<!-- stack:end -->`, substitua apenas o conteúdo entre os marcadores pela saída de `detect_stack.py --markdown`.

### 9. Validar antes de entregar
- [ ] Toda versão citada bate com o arquivo de origem.
- [ ] Todo comando citado existe e foi lido do projeto.
- [ ] Todo link relativo aponta para um arquivo existente.
- [ ] Nenhum segredo, token ou e-mail pessoal exposto sem autorização.
- [ ] Nenhum `TODO` esquecido sem ser mencionado ao usuário.
- [ ] Renderiza bem em Markdown do GitHub (tabelas alinhadas, blocos fechados).

## Resumo final ao usuário
Entregue em poucas linhas: o que foi alterado no README, quais dados vieram de qual arquivo, o que ficou como `TODO` e quais arquivos de comunidade estão faltando (licença, CONTRIBUTING, etc.), perguntando se deseja criá-los.

## Arquivos da skill
- `scripts/detect_stack.py`: detecta linguagens, runtimes, frameworks, serviços e versões. Opções: `--markdown` (tabela pronta), `--json`.
- `assets/README.template.md`: esqueleto completo do README.
- `references/open-source-checklist.md`: checklist de arquivos e boas práticas de projeto open source, com modelos curtos de CONTRIBUTING, SECURITY e escolha de licença.

## Idioma do README (Decisão D-08)
- Conforme decisão D-08: o `README.md` na raiz do repositório permanece em português (`pt-BR`) até a Fase 14. Na Fase 15, será fornecida a versão em inglês mantendo suporte bilíngue (`README.md` e `README.en.md`).
