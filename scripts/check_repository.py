#!/usr/bin/env python3
"""Check source syntax, symlinks and credential patterns in every reachable Git revision."""

import ast
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = {
    "OpenAI token": re.compile(rb"\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}"),
    "GitHub token": re.compile(rb"\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})"),
    "Hugging Face token": re.compile(rb"\bhf_[A-Za-z0-9]{25,}"),
    "AWS access key": re.compile(rb"\b(?:AKIA|ASIA)[A-Z0-9]{16}"),
    "private key": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
}


def main():
    paths = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).split(b"\0")
    py_count = json_count = 0
    for item in paths:
        if not item:
            continue
        path = ROOT / item.decode()
        if not path.exists():
            raise RuntimeError(f"Missing tracked path: {path.relative_to(ROOT)}")
        if path.is_symlink():
            assert path.resolve().is_relative_to(ROOT), f"Symlink escapes repository: {path}"
        elif path.suffix == ".py":
            ast.parse(path.read_text(), filename=str(path))
            py_count += 1
        elif path.suffix == ".json":
            json.loads(path.read_text())
            json_count += 1
    print(f"Python syntax: {py_count} files; JSON: {json_count} files; tracked paths exist.")

    objects = subprocess.check_output(["git", "rev-list", "--objects", "--all"], cwd=ROOT)
    names = {line.split(b" ", 1)[0]: line.split(b" ", 1)[-1].decode(errors="replace")
             for line in objects.splitlines()}
    info = subprocess.check_output(
        ["git", "cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)"],
        input=b"\n".join(names) + b"\n", cwd=ROOT,
    )
    candidates = []
    for line in info.splitlines():
        oid, kind, size = line.split()
        if kind in {b"blob", b"commit", b"tag"} and int(size) <= 4 * 1024 * 1024:
            candidates.append(oid)
    proc = subprocess.Popen(["git", "cat-file", "--batch"], cwd=ROOT,
                            stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    findings = []
    try:
        for oid in candidates:
            proc.stdin.write(oid + b"\n")
            proc.stdin.flush()
            size = int(proc.stdout.readline().split()[2])
            data = proc.stdout.read(size)
            proc.stdout.read(1)
            if b"\0" in data[:8192]:
                continue
            for label, pattern in PATTERNS.items():
                if pattern.search(data):
                    # Never print the credential value.
                    findings.append(f"{label}: {names[oid]} ({oid.decode()})")
    finally:
        proc.stdin.close()
        proc.wait()
    if findings:
        raise RuntimeError("Credential patterns found:\n" + "\n".join(findings))
    print(f"Credential pattern scan: {len(candidates)} reachable objects checked; no matches.")


if __name__ == "__main__":
    main()
