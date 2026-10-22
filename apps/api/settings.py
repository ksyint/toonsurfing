"""Paths and service settings shared by the imported API modules."""

import os
from pathlib import Path

API_DIR = Path(__file__).resolve().parent
ROOT_DIR = API_DIR.parents[1]


def configured_path(name: str, default: Path) -> Path:
    value = Path(os.environ.get(name, str(default))).expanduser()
    return value if value.is_absolute() else ROOT_DIR / value


IMAGE_DIR = configured_path("TOONSURFING_IMAGE_DIR", ROOT_DIR / "data/cuts")
CHARACTER_DIR = configured_path("TOONSURFING_CHARACTER_DIR", API_DIR / "character_images")
PIC2WORD_DIR = ROOT_DIR / "research/composed-image-retrieval"
PIC2WORD_CHECKPOINT = configured_path("PIC2WORD_CHECKPOINT", PIC2WORD_DIR / "pic2word_model.pt")
CLIP_URL = os.environ.get("CLIP_URL", "http://127.0.0.1:13131/knn-service")
CLIP_INDEX = os.environ.get("CLIP_INDEX", "index_h14")
