FROM node:12-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY ./src .
RUN npm run build

USER node
ENV PORT=8000
EXPOSE 8000

CMD ["node", "dist/main.js"]