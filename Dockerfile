FROM node:12.11.1-alpine
WORKDIR /usr/src/app

ARG ENVIRONMENT='development'

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.${ENVIRONMENT} /usr/src/app/.env

EXPOSE 80

CMD ["node", "src/server/index.js"]