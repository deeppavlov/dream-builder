FROM node:latest

RUN apt-get update || : && apt-get install python curl -y \
    && curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python - \
    && curl -f https://get.pnpm.io/v6.7.js | node - add --global pnpm

WORKDIR /code
COPY ./ /code

ENV PATH "$PATH:/root/.poetry/bin"

RUN cd tools/generate_types_from_schema && pnpm install && poetry install \
    && cd ../../ && pnpm run generate && pnpm install \
    && ./tools/run-in-all-dirs.sh poetry install
