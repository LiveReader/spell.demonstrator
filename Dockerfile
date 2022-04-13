FROM node:16-alpine

ARG NPM_TOKEN
WORKDIR /app
COPY .npmrc .npmrc
COPY package*.json ./
RUN npm install
RUN rm -f .npmrc
COPY . .
RUN npm run build

EXPOSE 80
CMD npm run serve
