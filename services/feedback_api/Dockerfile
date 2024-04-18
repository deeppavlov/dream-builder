FROM python:3.10.5-slim-buster

ARG PORT

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
ENV PORT=$PORT

COPY services/feedback_api/requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt

COPY services/feedback_api /src/services/feedback_api
COPY log_config.yml /src/log_config.yml

WORKDIR src/
CMD uvicorn services.feedback_api.app:app \
    --host 0.0.0.0 \
    --port $PORT \
    --log-config=log_config.yml \
    --reload
