FROM node:22-alpine

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN apk --no-cache --update add fontconfig ttf-dejavu

WORKDIR /project
COPY . .
RUN yarn
