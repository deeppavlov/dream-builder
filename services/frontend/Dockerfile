FROM node:latest

ARG FRONTEND_ENV

ENV FRONTEND_ENV=$FRONTEND_ENV

WORKDIR /app
COPY ./services/frontend/package.json .
RUN npm install
COPY ./services/frontend .

CMD npm run $FRONTEND_ENV
