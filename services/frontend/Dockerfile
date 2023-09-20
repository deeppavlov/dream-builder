FROM node:latest AS builder

ARG FRONTEND_ENV

ENV FRONTEND_ENV=$FRONTEND_ENV

WORKDIR /app
COPY ./services/frontend/package.json .
RUN npm install
COPY ./services/frontend .
RUN npm run build-$FRONTEND_ENV

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
