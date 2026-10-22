#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/apps/api/func1_clip"
exec clip-retrieval back --port 13131 --indices-paths indices_paths.json \
  --clip_model hf_clip:laion/CLIP-ViT-H-14-laion2B-s32B-b79K \
  --provide_safety_model False --provide_violence_detector False \
  --enable_mclip_option False --provide_aesthetic_embeddings False "$@"
