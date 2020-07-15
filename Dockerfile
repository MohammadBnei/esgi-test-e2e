FROM node:12.4-alpine

RUN apk add --no-cache tzdata

RUN apk add yarn

WORKDIR /usr/src/app

COPY ["package.json", "/usr/src/app/"]

RUN yarn

CMD export IP_ADDR=$(hostname -i) && yarn start


