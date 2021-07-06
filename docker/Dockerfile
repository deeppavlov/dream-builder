FROM node AS dev

RUN apt-get update \
    && apt-get install python tmux make openssh-server -y \
    && curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python - \
    && npm install -g pnpm \
    && service ssh start

EXPOSE 22/tcp
EXPOSE 8080/tcp
WORKDIR /code

# RUN cd ts && pnpm install \
#  && cd ../py && poetry install

CMD ["./tools/run-dev.sh"]
