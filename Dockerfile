FROM node:12.4-alpine

RUN apk add --no-cache tzdata

RUN apk add yarn

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "/usr/src/app/"]

RUN yarn

CMD yarn start


