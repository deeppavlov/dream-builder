FROM node:latest

WORKDIR /app
COPY ./services/frontend/package.json .
RUN npm install
COPY ./services/frontend .

CMD ["npm", "run", "dev"]
