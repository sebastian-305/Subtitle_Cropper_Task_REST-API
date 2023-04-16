FROM node:18-alpine3.17 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY src ./src
RUN npm run compile

FROM node:18-alpine3.17 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/scripts ./scripts
RUN npm install --only=production

FROM gcr.io/distroless/nodejs:18
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./

ENV SCT_PORT=3000 \
    SCT_CHUNK_WORDS_COUNT=1500 \
    SCT_INITIAL_LOGGERLEVEL=5 \
    SCT_SEPARATING_CHARS=!?. \
    SCT_MAX_REQUEST_SIZE=1mb


EXPOSE 3000

USER 1000
CMD ["./scripts/index.js"]
