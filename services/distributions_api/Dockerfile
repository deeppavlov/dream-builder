FROM python:3.10.5-slim-buster

WORKDIR src/

RUN apt-get update && apt-get install -y --no-install-recommends git
RUN git clone https://github.com/deeppavlov/dream.git

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
ENV DREAM_ROOT_PATH="/src/dream/"

COPY ./ ./distributions/

COPY requirements-api.txt .
RUN pip install --no-cache-dir -r /src/requirements-api.txt

WORKDIR ./distributions/
RUN ["python3" ,"-m", "uvicorn", "main:app", "--port", "80"]