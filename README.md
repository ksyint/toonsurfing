웹툰 크롤링 코드입니다. (현재는 네이버웹툰에 대해서만 동작)

직접 코드 실행시키기 귀찮으실 수도 있을 것 같아서, 몇 가지 웹툰의 이미지 공유드립니다.
- [치즈인더트랩](https://comic.naver.com/webtoon/list?titleId=720121)(1~9화) : https://drive.google.com/file/d/1RsSyvyJ5Hk81t5kfpYN6GEXdLNd3Tz6M/view?usp=drive_link
- [바른연애 길잡이](https://comic.naver.com/webtoon/list?titleId=703852)(1~12화) : https://drive.google.com/file/d/1uwlKWwEStPNfvPY0E7Woh4Z_mbfoqt9G/view?usp=drive_link
- [하루만 네가 되고 싶어](https://comic.naver.com/webtoon/list?titleId=738487)(1~50화) : https://drive.google.com/file/d/1CXU74TeILr3vaY13QsxWSldBtAzYzVYt/view?usp=drive_link

### Installation
```sh
conda create -n crawling python=3.10
conda activate crawling

conda install ipykernel pillow
pip install beautifulsoup4 requests tqdm
```

### Run
- `TOON_ID` : 네이버웹툰 특정 작품의 url(예시: https://comic.naver.com/webtoon/list?titleId=783053) 에 있는 `titleId=783053`의 값을 넣어주어야 합니다.
- `EPISODES` : 몇 화부터 몇 화까지 크롤링할지 입력합니다.
```sh
python crawl_naverWebtoon.py
```