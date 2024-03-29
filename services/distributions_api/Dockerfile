FROM python:3.10.5-slim-buster

ARG DREAM_ROOT_PATH
ARG DREAM_BRANCH
ARG PORT

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
ENV DREAM_ROOT_PATH=$DREAM_ROOT_PATH
ENV DREAM_BRANCH=$DREAM_BRANCH
ENV PORT=$PORT

RUN apt-get update && apt-get install -y --no-install-recommends git

RUN git config --global user.name "deepypavlova"
RUN git config --global user.email "publisher@deepdream.builders"

RUN git clone -b $DREAM_BRANCH https://github.com/deeppavlov/dream.git $DREAM_ROOT_PATH

COPY services/distributions_api/requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt

COPY services/distributions_api /src/services/distributions_api
COPY log_config.yml /src/log_config.yml

WORKDIR src/
CMD uvicorn services.distributions_api.app:app \
    --host 0.0.0.0 \
    --port $PORT \
    --log-config=log_config.yml \
    --reload
