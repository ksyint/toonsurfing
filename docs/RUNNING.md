# 실행 안내

명령은 통합 저장소 루트에서 실행합니다. 각 환경은 별도로 만들며 호스트의 기존 Python 환경을 변경할 필요가 없습니다.

## Git LFS

```bash
git lfs install
git lfs pull
git lfs fsck
```

현재 기본 브랜치의 Pic2Word 모델과 토크나이저를 받습니다. Git 이력만 빠르게 받으려면 `GIT_LFS_SKIP_SMUDGE=1 git clone ...`을 사용하고 필요한 시점에 `git lfs pull`을 실행합니다.

## 웹

```bash
make web-install
make web
```

기본 개발 주소는 `http://localhost:3000`입니다. `apps/web/.env.example`을 참고해 `apps/web/.env`에서 개발 API 프록시를 바꿀 수 있습니다. `REACT_APP_API_URL`은 React 빌드 시 반영되는 값입니다.

```bash
make web-build
# 별도 API 호스트를 사용하는 빌드의 예
REACT_APP_API_URL=https://example.com/api make web-build
```

프로덕션 정적 서버에서는 `/api/`를 API 서버로 전달하고 `/api` 접두사를 제거해야 합니다. SPA 화면 전환을 위해 `/select`, `/chat` 등의 요청은 `index.html`로 연결합니다.

## API 및 검색

```bash
python3.10 -m venv .venv-api
source .venv-api/bin/activate
pip install -r requirements/api.lock
cp .env.example .env
```

`.env`에 새 키와 데이터 경로를 설정합니다.

```dotenv
OPENAI_API_KEY=
TOONSURFING_IMAGE_DIR=data/cuts
CLIP_URL=http://127.0.0.1:13131/knn-service
CLIP_INDEX=index_h14
```

데이터는 `data/cuts/0001/001.jpg`와 같은 구조입니다. 상대 경로는 통합 저장소 루트를 기준으로 해석합니다. API 실행 스크립트가 루트 `.env`를 읽습니다. 새 키는 Git에 추가하지 않습니다.

터미널 두 개에서 같은 Python 환경을 활성화합니다.

```bash
make clip
make api
```

CLIP 서비스는 `apps/api/func1_clip/indices_paths.json`의 기존 `index_h14`를 사용합니다. 새 데이터의 임베딩·인덱스를 만들 때는 해당 디렉터리의 원본 README를 참고하고 모델 ID와 인덱스 이름을 일치시킵니다.

```bash
curl http://127.0.0.1:7000/health
curl -X POST http://127.0.0.1:7000/search-by-final \
  -H 'Content-Type: application/json' \
  -d '{"text_kor":"안경 낀 사람 때리면 살인 몇 화에 나온 대사야?"}'
```

첫 검색에는 모델 다운로드가 필요할 수 있습니다. Pic2Word 탭은 CUDA와 체크포인트를 요구합니다. 체크포인트 기본값은 `research/composed-image-retrieval/pic2word_model.pt`이고 `PIC2WORD_CHECKPOINT`로 변경할 수 있습니다.

`requirements/api.txt`는 서비스 의존성 범위이며 `api.lock`은 Python 3.10 대상으로 해석한 고정 버전입니다. GPU 패키지가 필요 없는 API 시작·HTTP 검증은 CPU PyTorch로 별도 환경을 구성할 수 있지만, Pic2Word의 CUDA 추론까지 CPU로 전환하는 코드는 포함하지 않았습니다.

## 수집

```bash
python3 -m venv .venv-crawling
source .venv-crawling/bin/activate
pip install -r requirements/crawling.txt
cd pipelines/crawling
python crawl_naverWebtoon_mp.py --toon_id 743838 \
  --epi_start_idx 1 --epi_end_idx 2 --webtoon_name sample --max_workers 4
```

크롤링은 실제 네트워크·다운로드를 수행합니다. 기존 단일 스레드 파일에는 작품 ID와 회차가 상수로 들어 있습니다.

## 컷 추출

```bash
python3 -m venv .venv-cuts
source .venv-cuts/bin/activate
pip install -r requirements/cut-extractor.txt
python pipelines/cut-extractor/main.py \
  --src pipelines/cut-extractor/girls-trial --dst /tmp/toonsurfing-cuts
```

`--src`는 회차 디렉터리를 포함하는 경로입니다. `--hlim`으로 최소·최대 높이를, `--tol`로 여백 색 허용치를 조절합니다. 원본 저장 결과는 현재 코드의 기본 인자로 다시 생성한 결과와 파일 수가 다를 수 있습니다.

## 연구 코드

- Pic2Word 독립 API: `research/composed-image-retrieval/README.md`의 Docker 구성을 해당 디렉터리에서 실행합니다. 공통 경로에 모델이 있으므로 원본 마운트 구조를 사용할 수 있습니다.
- KoLLaVA: `research/kollava`에서 Docker를 빌드한 뒤 원본 `run.sh`와 README를 사용합니다. 외부 KoLLaVA 소스는 Dockerfile의 커밋으로 고정되어 있습니다.
- OCR 실험: `research/dialogue-search`는 절대경로와 스키마를 조정해야 하는 원본 실험 자료입니다. 운영 API의 진입점이 아닙니다.

## 이력 탐색

```bash
git branch --list 'upstream/*'
git show import/2026-10-22:apps/web/package.json
git log --all --oneline --graph
make check
```

`docs/sources.json`에 원본 URL, 공개 여부, 기본 브랜치, 원본·가져온 커밋, 원본 트리 및 참조 매핑이 있습니다. 통합 저장소를 새로 복제하면 검증 스크립트가 원격 추적 브랜치도 인식합니다. 원본 보존 브랜치를 직접 로컬 브랜치로 가져오려면 다음 명령을 사용할 수 있습니다.

```bash
git fetch origin '+refs/heads/upstream/*:refs/heads/upstream/*'
make check
```

API의 질문 구조화 모델은 `OPENAI_MODEL`로 지정할 수 있습니다. 미설정 시 원본 모델 식별자인 `gpt-4-1106-preview`를 사용하므로 실제 실행 계정에서 사용할 수 있는 모델로 설정하세요.

모델·외부 검색 호출 없이 시작과 HTTP 경로만 확인하려면 API 환경을 활성화한 뒤 `python scripts/smoke_api.py`를 실행합니다. 번들 샘플 컷과 임시 포트를 사용하고 검증 후 서버를 종료합니다.
