FROM node:16-alpine

WORKDIR /app
COPY /client/package*.json /app/client/
RUN cd /app/client && npm install
COPY /client /app/client
RUN cd /app/client && npm run build

COPY /server/package*.json /app/server/
RUN cd /app/server && npm install
COPY /server /app/server

EXPOSE 80
CMD cd /app/server && npm start