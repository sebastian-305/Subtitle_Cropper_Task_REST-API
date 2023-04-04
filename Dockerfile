FROM node:19-slim
WORKDIR /usr/app
COPY package.json .
RUN npm install

COPY .env ./
COPY scripts ./scripts

EXPOSE 7331

CMD ["node", "."]
