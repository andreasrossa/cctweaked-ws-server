FROM node:16

WORKDIR /app

COPY dist ./dist
COPY node_modules ./node_modules

EXPOSE 3000
ENTRYPOINT ["node","dist/src/index.js"]