<!-- Substitua tudo entre <...>. Remova seções que não se aplicam. Não deixe placeholders no resultado final. -->

<div align="center">

<!-- <img src="./docs/logo.png" alt="Logo de <NOME>" width="120" /> -->

# <NOME DO PROJETO>

**<Tagline: o que é + para quem, em uma linha>**

[![Licença](https://img.shields.io/badge/licen%C3%A7a-<LICENCA>-blue.svg)](./LICENSE)
[![Versão](https://img.shields.io/github/v/release/<USUARIO>/<REPO>)](https://github.com/<USUARIO>/<REPO>/releases)
[![CI](https://github.com/<USUARIO>/<REPO>/actions/workflows/<ARQUIVO>.yml/badge.svg)](https://github.com/<USUARIO>/<REPO>/actions)
[![PRs bem-vindos](https://img.shields.io/badge/PRs-bem--vindos-brightgreen.svg)](./CONTRIBUTING.md)

[Demonstração](<URL>) · [Documentação](./docs) · [Reportar bug](https://github.com/<USUARIO>/<REPO>/issues/new?template=bug_report.md) · [Sugerir melhoria](https://github.com/<USUARIO>/<REPO>/issues/new?template=feature_request.md)

</div>

## Sobre o projeto

<2 a 4 frases: problema que resolve, solução, diferencial. Baseie-se no que o projeto JÁ faz hoje.>

### Funcionalidades

- <funcionalidade implementada 1>
- <funcionalidade implementada 2>
- <funcionalidade implementada 3>

## Demonstração

<!-- Inclua apenas se houver screenshot, GIF ou deploy. Caso contrário, remova a seção. -->
![Captura de tela de <NOME>](./docs/screenshot.png)

## Tecnologias e versões

<!-- stack:start -->
| Camada | Tecnologia | Versão | Papel |
|---|---|---|---|
| <camada> | <tecnologia> | `<versão>` | <papel> |
<!-- stack:end -->

> Versões extraídas de `<arquivos de origem>`. Faixas (`^`, `>=`) indicam a versão declarada; o lockfile fixa a versão exata instalada.

## Primeiros passos

### Pré-requisitos

- <Runtime> `<versão>` ou superior
- <Gerenciador de pacotes> `<versão>`
- <Docker / banco / serviço>, se necessário

### Instalação

```bash
git clone https://github.com/<USUARIO>/<REPO>.git
cd <REPO>
<comando de instalação>
```

### Configuração

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `<VARIAVEL>` | Sim/Não | <descrição> | `<exemplo>` |

### Executando

```bash
<comando para rodar em desenvolvimento>
```

Acesse <http://localhost:<PORTA>>.

<details>
<summary>Rodando com Docker</summary>

```bash
docker compose up --build
```

</details>

## Uso

```bash
<exemplo real de uso>
```

## Estrutura do projeto

```text
<REPO>/
├── <pasta>/      # <o que contém>
├── <pasta>/      # <o que contém>
└── README.md
```

## Testes e qualidade

```bash
<comando de testes>
<comando de lint>
<comando de build>
```

## Roadmap

- [x] <entregue>
- [ ] <planejado>

Veja as [issues abertas](https://github.com/<USUARIO>/<REPO>/issues) para propostas e problemas conhecidos.

## Contribuindo

Contribuições são bem-vindas. Leia o [guia de contribuição](./CONTRIBUTING.md) e o [código de conduta](./CODE_OF_CONDUCT.md) antes de abrir um pull request.

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feat/minha-melhoria`
3. Commit seguindo [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `git commit -m "feat: descrição"`
4. Envie: `git push origin feat/minha-melhoria`
5. Abra um Pull Request

## Segurança

Para relatar vulnerabilidades, siga a [política de segurança](./SECURITY.md). Não abra issues públicas para falhas de segurança.

## Licença

Distribuído sob a licença <LICENCA>. Veja [LICENSE](./LICENSE) para mais informações.

## Autor

**<Nome>**: [GitHub](https://github.com/<USUARIO>) · [LinkedIn](<URL>) · <contato>

## Agradecimentos

- <projeto, pessoa ou recurso que ajudou>
