FROM node:20.8.1 AS builder

ARG FRONTEND_ENV

ENV FRONTEND_ENV=$FRONTEND_ENV

ARG FRONTEND_ENV

ENV FRONTEND_ENV=$FRONTEND_ENV

WORKDIR /app

COPY ./services/frontend .
RUN npm install
RUN npm run build-$FRONTEND_ENV

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
