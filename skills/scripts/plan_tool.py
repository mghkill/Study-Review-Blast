#!/usr/bin/env python3
"""Gerencia a pasta plano-de-acao/ (PLANO.md + LINHA-DO-TEMPO.md).

Comandos:
  init                      cria a pasta a partir do plano inicial da skill
  status                    mostra progresso por fase, tarefa em andamento e próxima
  start  T-012              marca [~] e registra na linha do tempo
  done   T-012 [--nota ".."] marca [x] com data/hora e registra
  block  T-012 "motivo"     marca [!] e registra o motivo
  log    "mensagem"         registra decisão, achado ou comando na linha do tempo
  add-feature "Título" --task "..." --task "..."
                            acrescenta nova funcionalidade ao plano (nunca reescreve o passado)

Fuso: America/Bahia (variável PLANO_TZ muda). Nunca escreva senhas ou conteúdo de .env aqui.
"""
import argparse
import re
import shutil
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

for _s in (sys.stdout, sys.stderr):  # Windows: console/pipe pode usar cp1252
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SKILL_DIR = Path(__file__).resolve().parent.parent
HERE = Path(__file__).resolve().parent
TASK_RE = re.compile(r"^(\s*- \[)([ x~!])(\] )(T-\d+)(.*)$")
PROX_START, PROX_END = "<!-- proximo:start -->", "<!-- proximo:end -->"


def now():
    import os
    name = os.environ.get("PLANO_TZ", "America/Bahia")
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo(name))
    except Exception:
        return datetime.now(timezone(timedelta(hours=-3)))


def stamp():
    return now().strftime("%Y-%m-%d %H:%M")


def plan_dir(arg):
    if arg:
        return Path(arg)
    if (HERE / "PLANO.md").exists():
        return HERE
    return Path.cwd() / "plano-de-acao"


def read(p):
    return p.read_text(encoding="utf-8")


def write(p, s):
    p.write_text(s, encoding="utf-8")


def timeline_add(d, text):
    tl = d / "LINHA-DO-TEMPO.md"
    if not tl.exists():
        write(tl, "# Linha do tempo\n\nRegistro cronológico (mais antigo primeiro). Só se acrescenta; nunca se apaga.\n\n")
    with tl.open("a", encoding="utf-8") as f:
        f.write(f"- **{stamp()}** — {text}\n")


def parse(lines):
    """Retorna lista de (índice, fase, marca, id, texto)."""
    phase, out = "(sem fase)", []
    for i, line in enumerate(lines):
        if line.startswith("## "):
            phase = line[3:].strip()
        m = TASK_RE.match(line)
        if m:
            out.append((i, phase, m.group(2), m.group(4), m.group(5).strip()))
    return out


def refresh_next(d):
    p = d / "PLANO.md"
    lines = read(p).split("\n")
    tasks = parse(lines)
    doing = [t for t in tasks if t[2] == "~"]
    todo = [t for t in tasks if t[2] == " "]
    blocked = [t for t in tasks if t[2] == "!"]
    if doing:
        t = doing[0]; msg = f"Continuar **{t[3]}** (em andamento) — {t[4]}"
    elif todo:
        t = todo[0]; msg = f"Iniciar **{t[3]}** — {t[4]}"
    else:
        msg = "Nenhuma tarefa pendente. Conferir bloqueios e a Fase final."
    extra = f"\n- Bloqueadas: {', '.join(b[3] for b in blocked)}" if blocked else ""
    block = f"{PROX_START}\n- Atualizado em {stamp()}\n- {msg}{extra}\n{PROX_END}"
    txt = "\n".join(lines)
    if PROX_START in txt and PROX_END in txt:
        txt = re.sub(re.escape(PROX_START) + r".*?" + re.escape(PROX_END), lambda _: block, txt, flags=re.S)
    write(p, txt)


def set_mark(d, tid, mark, suffix=""):
    p = d / "PLANO.md"
    lines = read(p).split("\n")
    for i, line in enumerate(lines):
        m = TASK_RE.match(line)
        if m and m.group(4) == tid:
            rest = re.sub(r"\s+(✔|⏳|⛔) .*$", "", m.group(5))
            lines[i] = f"{m.group(1)}{mark}{m.group(3)}{tid}{rest}{suffix}"
            write(p, "\n".join(lines))
            return True
    return False


def cmd_init(a):
    d = plan_dir(a.dir)
    if (d / "PLANO.md").exists():
        print(f"Já existe {d}/PLANO.md — nada foi sobrescrito. Use 'status' para retomar.")
        return
    d.mkdir(parents=True, exist_ok=True)
    src = SKILL_DIR / "assets" / "PLANO.inicial.md"
    shutil.copy(src, d / "PLANO.md")
    if Path(__file__).resolve() != (d / "plan_tool.py").resolve():
        shutil.copy(Path(__file__), d / "plan_tool.py")
    timeline_add(d, "Plano criado a partir do plano inicial da skill studyreviewblast-planner.")
    refresh_next(d)
    print(f"Criado: {d}/PLANO.md, {d}/LINHA-DO-TEMPO.md, {d}/plan_tool.py")


def cmd_status(a):
    d = plan_dir(a.dir)
    tasks = parse(read(d / "PLANO.md").split("\n"))
    if not tasks:
        print("Nenhuma tarefa encontrada."); return
    phases = {}
    for _, ph, mk, tid, txt in tasks:
        phases.setdefault(ph, []).append((mk, tid, txt))
    total = len(tasks); done = sum(1 for t in tasks if t[2] == "x")
    print(f"Progresso geral: {done}/{total} ({100*done//total}%)\n")
    for ph, ts in phases.items():
        n = sum(1 for t in ts if t[0] == "x")
        print(f"{ph}: {n}/{len(ts)}")
    for label, mk in (("EM ANDAMENTO", "~"), ("BLOQUEADAS", "!")):
        items = [t for t in tasks if t[2] == mk]
        if items:
            print(f"\n{label}:")
            for t in items: print(f"  {t[3]} {t[4]}")
    nxt = [t for t in tasks if t[2] == " "]
    if nxt:
        print(f"\nPRÓXIMA: {nxt[0][3]} {nxt[0][4]}")


def cmd_start(a):
    d = plan_dir(a.dir)
    if not set_mark(d, a.id, "~", f" ⏳ {stamp()}"):
        sys.exit(f"Tarefa {a.id} não encontrada.")
    timeline_add(d, f"[{a.id}] iniciada.")
    refresh_next(d); print(f"{a.id} em andamento.")


def cmd_done(a):
    d = plan_dir(a.dir)
    if not set_mark(d, a.id, "x", f" ✔ {stamp()}"):
        sys.exit(f"Tarefa {a.id} não encontrada.")
    timeline_add(d, f"[{a.id}] concluída." + (f" {a.nota}" if a.nota else ""))
    refresh_next(d); print(f"{a.id} concluída.")


def cmd_block(a):
    d = plan_dir(a.dir)
    if not set_mark(d, a.id, "!", f" ⛔ {a.motivo}"):
        sys.exit(f"Tarefa {a.id} não encontrada.")
    timeline_add(d, f"[{a.id}] bloqueada: {a.motivo}")
    refresh_next(d); print(f"{a.id} bloqueada.")


def cmd_log(a):
    d = plan_dir(a.dir)
    timeline_add(d, a.mensagem); print("Registrado.")


def cmd_add_feature(a):
    d = plan_dir(a.dir)
    p = d / "PLANO.md"
    txt = read(p)
    nums = [int(n) for n in re.findall(r"\bT-(\d+)\b", txt)]
    nxt = max(nums, default=0) + 1
    feats = [int(n) for n in re.findall(r"Funcionalidade adicionada N[º°] ?(\d+)", txt)]
    fnum = max(feats, default=0) + 1
    out = [f"\n## Funcionalidade adicionada Nº {fnum} — {a.titulo} (em {stamp()})"]
    ids = []
    for t in a.task or ["Detalhar tarefas desta funcionalidade"]:
        tid = f"T-{nxt:03d}"; ids.append(tid); nxt += 1
        out.append(f"- [ ] {tid} {t}")
    write(p, txt.rstrip("\n") + "\n" + "\n".join(out) + "\n")
    timeline_add(d, f"Nova funcionalidade Nº {fnum} adicionada: {a.titulo} ({', '.join(ids)}).")
    refresh_next(d); print(f"Adicionada: {a.titulo} → {', '.join(ids)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dir", help="pasta do plano (padrão: ./plano-de-acao ou a pasta deste script)")
    sp = ap.add_subparsers(dest="cmd", required=True)
    sp.add_parser("init").set_defaults(f=cmd_init)
    sp.add_parser("status").set_defaults(f=cmd_status)
    s = sp.add_parser("start"); s.add_argument("id"); s.set_defaults(f=cmd_start)
    s = sp.add_parser("done"); s.add_argument("id"); s.add_argument("--nota"); s.set_defaults(f=cmd_done)
    s = sp.add_parser("block"); s.add_argument("id"); s.add_argument("motivo"); s.set_defaults(f=cmd_block)
    s = sp.add_parser("log"); s.add_argument("mensagem"); s.set_defaults(f=cmd_log)
    s = sp.add_parser("add-feature"); s.add_argument("titulo"); s.add_argument("--task", action="append"); s.set_defaults(f=cmd_add_feature)
    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
