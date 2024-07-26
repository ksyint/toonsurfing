## 이게 뭘까요?

해당 코드는 웹툰에서 컷 단위로 장면을 뽑아내는 코드입니다. 웹툰 크롤링 데이터는 [이 레포](https://github.com/team-vvave/crawling)에서 다운로드할 수 있습니다.

컷 추출이 완료된 결과는 [해당 링크](https://drive.google.com/file/d/1qFFPc8fSEoDhfA7b88QZ08GmEaBk3bHS/view?usp=sharing)에서 다운로드 가능합니다.


## 사용방법

폴더 구조는 `[작품명]-[회차]-[장면번호]` 형태로 만들어주세요.

예를 들어 다음과 같이:

```
소녀재판/
├─ 0001/
│  ├─ 001.jpg
│  ├─ 002.jpg
│  ├─ 003.jpg
├─ 0002/
│  ├─ 001.jpg
│  ├─ 002.jpg
```

그런 다음, 다음 파이썬 커맨드를 실행하세요.

```bash
python main.py --src [작품명] --dst [저장할폴더]
```
