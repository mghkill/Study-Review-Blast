#!/usr/bin/env python3
"""Detecta tecnologias, serviços e versões declaradas em um projeto.

Uso:
    python detect_stack.py [pasta] [--markdown | --json]

Prioridade de versão: lockfile (exata) > manifesto (faixa declarada).
Cada item traz o arquivo de origem para que o README seja verificável.
"""
import json
import re
import sys
from pathlib import Path

try:
    import tomllib  # Python 3.11+
except ModuleNotFoundError:  # pragma: no cover
    tomllib = None

for _s in (sys.stdout, sys.stderr):  # Windows: console/pipe pode usar cp1252
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

KNOWN_NPM = {
    "next": ("Frontend", "Framework React full-stack"),
    "react": ("Frontend", "Biblioteca de UI"),
    "vue": ("Frontend", "Framework de UI"),
    "nuxt": ("Frontend", "Framework Vue full-stack"),
    "svelte": ("Frontend", "Framework de UI"),
    "@sveltejs/kit": ("Frontend", "Framework Svelte full-stack"),
    "astro": ("Frontend", "Framework de sites estáticos"),
    "@angular/core": ("Frontend", "Framework de UI"),
    "vite": ("Build", "Bundler e dev server"),
    "tailwindcss": ("Frontend", "Framework CSS utilitário"),
    "typescript": ("Linguagem e runtime", "Tipagem estática"),
    "express": ("Backend", "Framework HTTP"),
    "fastify": ("Backend", "Framework HTTP"),
    "@nestjs/core": ("Backend", "Framework backend"),
    "prisma": ("Banco de dados e serviços", "ORM / migrações"),
    "@prisma/client": ("Banco de dados e serviços", "Cliente ORM"),
    "drizzle-orm": ("Banco de dados e serviços", "ORM"),
    "mongoose": ("Banco de dados e serviços", "ODM para MongoDB"),
    "pg": ("Banco de dados e serviços", "Driver PostgreSQL"),
    "mysql2": ("Banco de dados e serviços", "Driver MySQL"),
    "redis": ("Banco de dados e serviços", "Cliente Redis"),
    "next-auth": ("Backend", "Autenticação"),
    "zod": ("Qualidade", "Validação de esquemas"),
    "jest": ("Qualidade", "Testes"),
    "vitest": ("Qualidade", "Testes"),
    "playwright": ("Qualidade", "Testes E2E"),
    "@playwright/test": ("Qualidade", "Testes E2E"),
    "cypress": ("Qualidade", "Testes E2E"),
    "eslint": ("Qualidade", "Lint"),
    "prettier": ("Qualidade", "Formatação"),
    "framer-motion": ("Frontend", "Animações"),
    "@react-pdf/renderer": ("Frontend", "Geração de PDF"),
}
KNOWN_PY = {
    "django": ("Backend", "Framework web"),
    "flask": ("Backend", "Microframework web"),
    "fastapi": ("Backend", "Framework de APIs"),
    "sqlalchemy": ("Banco de dados e serviços", "ORM"),
    "alembic": ("Banco de dados e serviços", "Migrações"),
    "psycopg2": ("Banco de dados e serviços", "Driver PostgreSQL"),
    "psycopg": ("Banco de dados e serviços", "Driver PostgreSQL"),
    "celery": ("Backend", "Fila de tarefas"),
    "pydantic": ("Qualidade", "Validação"),
    "pytest": ("Qualidade", "Testes"),
    "ruff": ("Qualidade", "Lint/formatação"),
    "black": ("Qualidade", "Formatação"),
    "mypy": ("Qualidade", "Checagem de tipos"),
    "pandas": ("Dados", "Análise de dados"),
    "numpy": ("Dados", "Computação numérica"),
}


def read(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


def add(items, layer, tech, version, role, source):
    items.append({"layer": layer, "tech": tech, "version": version or "—",
                  "role": role, "source": source})


def npm_locked(root: Path):
    lock = root / "package-lock.json"
    if not lock.exists():
        return {}
    try:
        data = json.loads(read(lock))
    except json.JSONDecodeError:
        return {}
    out = {}
    for path, meta in (data.get("packages") or {}).items():
        if path.startswith("node_modules/") and path.count("node_modules/") == 1:
            out[path[len("node_modules/"):]] = meta.get("version")
    return out


def detect_node(root, items):
    pkg = root / "package.json"
    if not pkg.exists():
        return
    try:
        data = json.loads(read(pkg))
    except json.JSONDecodeError:
        return
    locked = npm_locked(root)
    engines = data.get("engines") or {}
    if "node" in engines:
        add(items, "Linguagem e runtime", "Node.js", engines["node"],
            "Runtime JavaScript (engines)", "package.json")
    nvmrc = root / ".nvmrc"
    if nvmrc.exists():
        add(items, "Linguagem e runtime", "Node.js", read(nvmrc).strip(),
            "Runtime JavaScript (.nvmrc)", ".nvmrc")
    pm = data.get("packageManager")
    if pm:
        name, _, ver = pm.partition("@")
        add(items, "Linguagem e runtime", name, ver.split("+")[0],
            "Gerenciador de pacotes", "package.json")
    deps = {**(data.get("dependencies") or {}), **(data.get("devDependencies") or {})}
    for name, declared in deps.items():
        if name in KNOWN_NPM:
            layer, role = KNOWN_NPM[name]
            exact = locked.get(name)
            add(items, layer, name, exact or declared, role,
                "package-lock.json" if exact else "package.json")


def parse_req_line(line):
    line = line.split("#")[0].strip()
    m = re.match(r"^([A-Za-z0-9_.\-]+)\s*(?:\[.*?\])?\s*([<>=!~]=?.*)?$", line)
    if not m:
        return None, None
    return m.group(1).lower().replace("_", "-"), (m.group(2) or "").strip()


def detect_python(root, items):
    pv = root / ".python-version"
    if pv.exists():
        add(items, "Linguagem e runtime", "Python", read(pv).strip(),
            "Runtime Python", ".python-version")
    declared = []
    pyproject = root / "pyproject.toml"
    if pyproject.exists() and tomllib:
        try:
            data = tomllib.loads(read(pyproject))
        except Exception:
            data = {}
        proj = data.get("project", {})
        if proj.get("requires-python"):
            add(items, "Linguagem e runtime", "Python", proj["requires-python"],
                "Runtime Python (requires-python)", "pyproject.toml")
        declared += proj.get("dependencies", [])
        for group in (proj.get("optional-dependencies") or {}).values():
            declared += group
        poetry = data.get("tool", {}).get("poetry", {})
        poetry_deps = {**poetry.get("dependencies", {}),
                       **poetry.get("group", {}).get("dev", {}).get("dependencies", {})}
        for k, v in poetry_deps.items():
            if k.lower() == "python":
                add(items, "Linguagem e runtime", "Python", str(v),
                    "Runtime Python (poetry)", "pyproject.toml")
            else:
                ver = "" if str(v) in ("*", "") or isinstance(v, dict) else "==" + str(v).lstrip("^~")
                declared.append(f"{k}{ver}")
    for req in root.glob("requirements*.txt"):
        declared += [l for l in read(req).splitlines() if l.strip() and not l.startswith("-")]
    for line in declared:
        name, ver = parse_req_line(line)
        if name in KNOWN_PY:
            layer, role = KNOWN_PY[name]
            add(items, layer, name, ver, role, "pyproject.toml / requirements")


def detect_others(root, items):
    gomod = root / "go.mod"
    if gomod.exists():
        m = re.search(r"^go\s+([\d.]+)", read(gomod), re.M)
        if m:
            add(items, "Linguagem e runtime", "Go", m.group(1), "Linguagem", "go.mod")
    cargo = root / "Cargo.toml"
    if cargo.exists() and tomllib:
        try:
            pkg = tomllib.loads(read(cargo)).get("package", {})
            ver = pkg.get("rust-version") or (f"edition {pkg['edition']}" if pkg.get("edition") else None)
            add(items, "Linguagem e runtime", "Rust", ver, "Linguagem", "Cargo.toml")
        except Exception:
            pass
    composer = root / "composer.json"
    if composer.exists():
        try:
            req = json.loads(read(composer)).get("require", {})
            if "php" in req:
                add(items, "Linguagem e runtime", "PHP", req["php"], "Linguagem", "composer.json")
            for k, v in req.items():
                if k.startswith(("laravel/framework", "symfony/framework")):
                    add(items, "Backend", k, v, "Framework web", "composer.json")
        except json.JSONDecodeError:
            pass
    tv = root / ".tool-versions"
    if tv.exists():
        for line in read(tv).splitlines():
            parts = line.split()
            if len(parts) >= 2:
                add(items, "Linguagem e runtime", parts[0], parts[1],
                    "Versão fixada (asdf)", ".tool-versions")


SERVICES = ("postgres", "mysql", "mariadb", "mongo", "redis", "rabbitmq",
            "kafka", "minio", "elasticsearch", "memcached")


def detect_docker(root, items):
    for df in root.glob("Dockerfile*"):
        for m in re.finditer(r"^FROM\s+(?:--platform=\S+\s+)?(\S+)", read(df), re.M | re.I):
            name, _, tag = m.group(1).partition(":")
            add(items, "Infraestrutura e DevOps", f"Docker: {name}", tag or "latest",
                "Imagem base", df.name)
    for cf in ("docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"):
        p = root / cf
        if p.exists():
            for m in re.finditer(r"^\s*image:\s*['\"]?([^'\"\s]+)", read(p), re.M):
                name, _, tag = m.group(1).partition(":")
                layer = ("Banco de dados e serviços" if any(s in name for s in SERVICES)
                         else "Infraestrutura e DevOps")
                add(items, layer, name, tag or "latest", "Serviço no Compose", cf)
    wf = root / ".github" / "workflows"
    if wf.exists():
        names = ", ".join(sorted(f.name for f in wf.glob("*.y*ml")))
        add(items, "Infraestrutura e DevOps", "GitHub Actions", None,
            f"CI/CD ({names})", ".github/workflows")


def dedupe(items):
    seen, out = set(), []
    for it in items:
        key = (it["tech"].lower(), it["version"])
        if key not in seen:
            seen.add(key)
            out.append(it)
    return out


ORDER = ["Linguagem e runtime", "Frontend", "Backend", "Banco de dados e serviços",
         "Dados", "Build", "Infraestrutura e DevOps", "Qualidade"]


def to_markdown(items):
    items = sorted(items, key=lambda i: (ORDER.index(i["layer"]) if i["layer"] in ORDER else 99,
                                         i["tech"].lower()))
    lines = ["| Camada | Tecnologia | Versão | Papel |", "|---|---|---|---|"]
    for i in items:
        lines.append(f"| {i['layer']} | {i['tech']} | `{i['version']}` | {i['role']} |")
    return "\n".join(lines)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    root = Path(args[0] if args else ".").resolve()
    items = []
    detect_node(root, items)
    detect_python(root, items)
    detect_others(root, items)
    detect_docker(root, items)
    items = dedupe(items)
    if "--json" in sys.argv:
        print(json.dumps({"root": str(root), "items": items}, ensure_ascii=False, indent=2))
    elif "--markdown" in sys.argv:
        print(to_markdown(items))
    else:
        print(f"Projeto: {root}\nItens detectados: {len(items)}\n")
        for i in items:
            print(f"- [{i['layer']}] {i['tech']} {i['version']}  ({i['role']}; origem: {i['source']})")
        if not items:
            print("Nenhuma tecnologia reconhecida. Leia os manifestos manualmente.")


if __name__ == "__main__":
    main()
