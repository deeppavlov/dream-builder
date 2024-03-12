FROM python:3.10.5-slim-buster

ENV PYTHONPATH=/src:$PYTHONPATH
ENV AWS_CONFIG_FILE=/.aws/config
ENV AWS_SHARED_CREDENTIALS_FILE=/.aws/credentials

RUN apt-get update && apt-get install -y --no-install-recommends \
      awscli \
      ca-certificates \
      curl \
      gnupg \
      git && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce=5:24.0.9-1~debian.10~buster docker-ce-cli=5:24.0.9-1~debian.10~buster containerd.io docker-buildx-plugin >

COPY services/deployment_worker/requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir -r /src/requirements.txt

#COPY services/deployment_worker /src/services/deployment_worker
#COPY log_config.yml /src/log_config.yml

RUN useradd -ms /bin/bash deepypavlova
RUN mkdir -p /dream && \
	chown -R deepypavlova:1600400037 /dream && \
	mkdir -p /.aws && \
	chown -R deepypavlova:1600400037 /.aws
USER deepypavlova

RUN git config --global user.name "deepypavlova"
RUN git config --global user.email "publisher@deepdream.builders"

WORKDIR src/
CMD celery -A deployment_queue.tasks:app worker --loglevel=info -Q deployments
