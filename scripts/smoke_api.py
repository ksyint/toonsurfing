#!/usr/bin/env python3
"""Start the real API offline and verify its HTTP contract using the bundled sample cuts."""

import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    images = ROOT / "research/composed-image-retrieval/code/result"
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    env = {
        **os.environ,
        "TOONSURFING_IMAGE_DIR": str(images),
        "HF_HUB_OFFLINE": "1",
        "TRANSFORMERS_OFFLINE": "1",
        "GRADIO_ANALYTICS_ENABLED": "False",
        "OPENAI_API_KEY": "",
    }
    python = os.environ.get("TOONSURFING_PYTHON", sys.executable)
    with tempfile.TemporaryDirectory(prefix="toonsurfing-smoke-") as temp:
        log = Path(temp) / "api.log"
        with log.open("wb") as output:
            proc = subprocess.Popen(
                [python, "demo.py", "--host", "127.0.0.1", "--port", str(port)],
                cwd=ROOT / "apps/api", env=env, stdout=output, stderr=subprocess.STDOUT,
            )
            try:
                url = f"http://127.0.0.1:{port}"
                for _ in range(60):
                    if proc.poll() is not None:
                        raise RuntimeError("API startup failed:\n" + log.read_text())
                    try:
                        with urllib.request.urlopen(url + "/health", timeout=1) as response:
                            assert json.load(response) == {"status": "ok"}
                        break
                    except (urllib.error.URLError, TimeoutError):
                        time.sleep(1)
                else:
                    raise RuntimeError("API startup timed out:\n" + log.read_text())
                with urllib.request.urlopen(url + "/openapi.json") as response:
                    spec = json.load(response)
                for path in ["/search-by-text", "/search-by-dialogue", "/search-by-final", "/health"]:
                    assert path in spec["paths"], path
                sample = next(images.glob("*/*.jpg"))
                with urllib.request.urlopen(url + "/images/" + str(sample.relative_to(images))) as response:
                    assert response.read() == sample.read_bytes()
                with urllib.request.urlopen(url + "/demo/") as response:
                    assert response.status == 200
                with urllib.request.urlopen(url + "/demo/config") as response:
                    names = {d.get("api_name") for d in json.load(response)["dependencies"]}
                    assert {"search_by_text", "search_by_dialogue", "search_by_final"} <= names
                request = urllib.request.Request(
                    url + "/search-by-final", data=b"{}", headers={"Content-Type": "application/json"},
                )
                try:
                    urllib.request.urlopen(request)
                    raise AssertionError("Expected request validation error")
                except urllib.error.HTTPError as exc:
                    assert exc.code == 422, exc.code
                print("API startup, health, OpenAPI, static JPEG, Gradio UI/config and 422 validation passed.")
                print("No external model downloads or search API calls were needed.")
            finally:
                proc.terminate()
                try:
                    proc.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    proc.wait()


if __name__ == "__main__":
    main()
