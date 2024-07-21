웹툰 크롤링 코드입니다. (현재는 네이버웹툰에 대해서만 동작)

- `TOON_ID` : 네이버웹툰 특정 작품의 url(예:https://comic.naver.com/webtoon/list?titleId=783053&tab=tue)에 있는 `titleId=783053`의 값을 넣어주어야 합니다.
- `EPISODES` : 몇 화부터 몇 화까지 크롤링할지 입력합니다.

### Installation
```sh
conda create -n crawling python=3.10
conda activate crawling

conda install ipykernel pillow
pip install beautifulsoup4 requests tqdm
```