FROM python:3.10.5-slim-buster

WORKDIR src/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

COPY tests/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY tests/backend /src/tests/backend

CMD ["pytest", "tests/backend", "-v"]
