FROM python:3.10.5-slim-buster

WORKDIR src/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

COPY ./services/auth_api/requirements-auth.txt .
RUN pip install --no-cache-dir -r /src/requirements-auth.txt


COPY ./services/auth_api ./auth_api/
WORKDIR ./auth_api

CMD ["python3" ,"-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "6000"]
CMD ["python3", "-m", "pytest", "./tests/"]
