FROM node:19-slim
WORKDIR /usr/app
COPY package.json .
RUN npm install

COPY .env ./
COPY scripts ./scripts

VOLUME /usr/app/logs

EXPOSE 7331

CMD node . > logs/app.log 2>&1
