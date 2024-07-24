docker run --rm -ti \
    -v ./cache:/cache \
    -v ./code:/code \
    -w /code \
    --gpus all \
    --ipc=host --ulimit memlock=-1 --ulimit stack=67108864 \
    --name kollava \
    kollava \
    bash