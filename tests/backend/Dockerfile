FROM python:3.10.5-slim-buster

WORKDIR src/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends git

COPY tests/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY tests/backend /src/tests/backend

CMD ["pytest", "tests/backend", "-sv", "-m", "regression"]
