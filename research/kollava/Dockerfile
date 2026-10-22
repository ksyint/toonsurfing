# FROM nvcr.io/nvidia/pytorch:24.06-py3
FROM nvcr.io/nvidia/cuda:11.8.0-runtime-ubuntu22.04
RUN apt update
RUN apt install python3 python3-pip --yes
RUN apt install git --yes
WORKDIR /
RUN git clone https://github.com/tabtoyou/KoLLaVA.git
WORKDIR /KoLLaVA
RUN git reset --hard 263e78b1d843ee93825092fff8aa84eab793948f
RUN pip install -U pip
RUN pip install -e .
ENV HF_HOME=/cache