FROM node:latest

RUN apt-get update || : && apt-get install python curl -y \
    && curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python - \
    && curl -f https://get.pnpm.io/v6.7.js | node - add --global pnpm

WORKDIR /code
COPY ./ /code
RUN PATH=$PATH:/root/.poetry/bin pnpm run generate && pnpm install
