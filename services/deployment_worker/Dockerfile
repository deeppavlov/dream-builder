FROM python:3.10.5-slim-buster

ENV PYTHONPATH=/src:$PYTHONPATH

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY services/deployment_worker/requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt

#COPY services/deployment_worker /src/services/deployment_worker
#COPY log_config.yml /src/log_config.yml

WORKDIR src/
CMD celery -A deployment_queue.tasks:app worker --loglevel=info --uid=1 -Q deployments
