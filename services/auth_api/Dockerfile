FROM python:3.10.5-slim-buster

WORKDIR src/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

COPY ./ ./auth_api/
COPY requirements-api.txt .
RUN pip install --no-cache-dir -r /src/requirements-api.txt

CMD ["python3" ,"-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
