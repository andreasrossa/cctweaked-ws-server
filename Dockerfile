FROM node:16

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./dist ./dist
EXPOSE 3000
ENTRYPOINT ["node","dist/src/index.js"]