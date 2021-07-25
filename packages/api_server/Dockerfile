FROM python:3.7.9

RUN pip install poetry

WORKDIR /code

CMD "poetry install --no-interaction --no-ansi && poetry run uvicorn server.main:app --reload"
