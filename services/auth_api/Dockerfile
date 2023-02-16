FROM python:3.10.5-slim-buster

ARG PORT

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
ENV PORT=$PORT

COPY services/auth_api/requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt
COPY ./client_secret.json /src/

COPY services/auth_api /src/services/auth_api

WORKDIR src/
CMD uvicorn services.auth_api.app:app --host 0.0.0.0 --port $PORT --reload
