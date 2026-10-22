#!/usr/bin/env python3
"""Verify import completeness without requiring access to the original organization."""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def main():
    manifest = json.loads((ROOT / "docs/sources.json").read_text())
    repos = manifest["repositories"]
    assert len(repos) == 9, "Expected all nine team-vvave repositories"
    ref_count = 0
    for repo in repos:
        # The immutable import tag records the exact tree before integration edits.
        actual_tree = git("rev-parse", f"import/2026-10-22:{repo['path']}")
        assert actual_tree == repo["source_tree"], f"Incomplete source tree: {repo['name']}"
        subprocess.run(
            ["git", "merge-base", "--is-ancestor", repo["imported_commit"], "HEAD"],
            cwd=ROOT, check=True,
        )
        for ref in repo["refs"]:
            name = ref["imported_ref"]
            # A fresh clone keeps source branches under refs/remotes/origin.
            local = subprocess.run(["git", "rev-parse", "--verify", name], cwd=ROOT,
                                   capture_output=True, text=True)
            if local.returncode and name.startswith("refs/heads/"):
                name = "refs/remotes/origin/" + name.removeprefix("refs/heads/")
            assert git("rev-parse", name) == ref["commit"], name
            ref_count += 1
        print(f"OK {repo['name']} -> {repo['path']}")
    modes = git("ls-files", "--stage").splitlines()
    assert not any(line.startswith("160000 ") for line in modes), "Unexpected submodule"
    print(f"Verified {len(repos)} source trees and {ref_count} source refs; no submodules.")


if __name__ == "__main__":
    main()
