FROM node:8.15.0-alpine

WORKDIR /app

ADD index.js /app

CMD ["node","index.js"]
