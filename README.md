다음 커맨드와 같이 이미지를 빌드합니다.

```bash
# BUILD DOCKER IMAGE
docker build --tag kollava .
```

다음 커맨드와 같이 컨테이너를 실행합니다.

```bash
# RUN CONTAINER
docker run --rm -ti \
    -v ./cache:/cache \
    -v ./code:/code \
    -w /code \
    --gpus all \
    --ipc=host \
    --ulimit memlock=-1 \
    --ulimit stack=67108864 \
    --name kollava \
    kollava \
    bash
```

모든 파이썬 스크립트는 컨테이너 안에서 실행됩니다.

웹에 있는 이미지를 기반으로 인퍼런스를 진행할 경우, 다음과 같이 실행하세요.

```bash
# IN THE CONTAINER
python3 infer.py -s https://image.balcony.studio/ko/co_thumbnail/5941/differentK%5Em.jpg
```

로컬 이미지를 기반으로 인퍼런스를 진행할 경우, 다음과 같이 실행하세요.

```bash
# IN THE CONTAINER
python3 infer.py -s images/cut5.png
```