# ToonSurfing

team-vvave의 **전체 9개 저장소**를 통합한 웹툰 장면·대사 검색 모노레포입니다. React 화면, FastAPI/Gradio API, CLIP·LaBSE·Pic2Word 검색, 수집·컷 추출 및 연구 코드를 함께 관리합니다.

| 경로 | 원본 저장소 | 역할 |
| --- | --- | --- |
| `apps/web` | `toonsurfing_frontend` | React 검색 화면 |
| `apps/api` | `gradio_demo_api` | FastAPI, Gradio, 검색 조합 |
| `pipelines/crawling` | `crawling` | 네이버 웹툰 이미지 수집 |
| `pipelines/cut-extractor` | `cut-extractor` | 이미지의 여백을 기준으로 컷 분리 |
| `research/composed-image-retrieval` | `composed-image-retrieval` | 공통 Pic2Word 모델·샘플·학습 코드 |
| `research/kollava` | `kollava` | KoLLaVA 장면 설명 실험 |
| `research/dialogue-search` | `dialogue_search` | OCR·대사 검색 실험 |
| `archive/image-retrieval` | `image_retrieval` | 원본 시작 파일 보관 |
| `docs/upstream-profile` | `.github` | 원본 조직 소개 보관 |

원본 기본 브랜치의 전체 트리는 `import/2026-10-22` 태그에 보관되어 있습니다. 원본 개발 브랜치와 PR 커밋은 `upstream/<저장소명>/...` 브랜치에서 확인할 수 있습니다. 소스에 있던 인증정보 2개는 관련 저장소의 이전 커밋에서도 제거했으며, 해당 이력의 SHA는 변경되었습니다. 원본·통합 SHA와 경로는 [sources.json](docs/sources.json)에 기록했습니다.

## 빠른 시작

프런트엔드는 Node.js 18, API는 별도의 Python 3.10 환경을 사용합니다. 컷 추출 코드는 Python 3.10 이상에서 실행할 수 있습니다.

```bash
git lfs install
git clone https://github.com/ksyint/toonsurfing.git
cd toonsurfing
make web-install
make web-build
make web
```

개발 화면은 `http://localhost:3000`에서 실행되며 `/api` 요청은 `http://127.0.0.1:7000`으로 전달됩니다. 원본에 UI 이미지가 커밋되어 있지 않아 기본 SVG 이미지를 포함했습니다. 검색을 실행하려면 아래 API와 데이터도 준비해야 합니다.

```bash
python3.10 -m venv .venv-api
source .venv-api/bin/activate
pip install -r requirements/api.lock
cp .env.example .env
# .env에 새 OPENAI_API_KEY와 TOONSURFING_IMAGE_DIR를 설정합니다.
make clip  # 별도 터미널: 기존 CLIP 인덱스, 포트 13131
make api   # 별도 터미널: FastAPI/Gradio, 포트 7000
```

- API 문서: `http://127.0.0.1:7000/docs`
- Gradio: `http://127.0.0.1:7000/demo`
- 상태 확인: `http://127.0.0.1:7000/health`
- 컷 이미지: `http://127.0.0.1:7000/images/<회차>/<컷>.jpg`

전체 원본 컷 데이터는 저장소에 없습니다. 기본 경로는 `data/cuts/<회차>/<컷>.jpg`이며, 실제 데이터 위치를 `.env`의 `TOONSURFING_IMAGE_DIR`로 지정합니다. Pic2Word 체크포인트와 토크나이저는 Git LFS로 보존했습니다. CLIP·LaBSE 모델은 해당 기능을 사용할 때 별도로 내려받습니다. 자세한 절차와 실험별 실행 방법은 [실행 안내](docs/RUNNING.md)에 있습니다.

## 검증과 분석

```bash
make check      # 9개 원본 트리·12개 참조 보존, Python/JSON, 이력의 인증정보 패턴 검사
make web-build
```

[구조와 데이터 흐름](docs/ARCHITECTURE.md), [저장소별 분석 및 남은 제약](docs/REPOSITORY_REVIEW.md), [검증 기록](docs/VALIDATION.md)을 참고하세요. Python 의존성은 모델 환경의 충돌을 피하도록 프런트엔드·수집·컷 추출·API·KoLLaVA별로 분리했습니다.

원본에 포함된 Apache-2.0 라이선스와 서드파티 고지는 각 디렉터리에 보존했습니다. 다른 원본 저장소에는 별도 라이선스 파일이 없어 전체 저장소에 새 라이선스를 부여하지 않았습니다.
