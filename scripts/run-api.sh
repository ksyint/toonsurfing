#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi
cd "$ROOT_DIR/apps/api"
exec "${TOONSURFING_PYTHON:-python3}" demo.py --host 127.0.0.1 --port 7000 "$@"
