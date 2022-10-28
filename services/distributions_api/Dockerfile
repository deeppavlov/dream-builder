FROM python:3.10.5-slim-buster

WORKDIR src/

RUN apt-get update && apt-get install -y --no-install-recommends git
RUN git clone https://github.com/deeppavlov/dream.git

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

COPY ./ ./deeppavlov_dreamtools/

COPY requirements-api.txt .
RUN pip install --no-cache-dir -r /src/requirements-api.txt

CMD ["python3" ,"-m", "uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]