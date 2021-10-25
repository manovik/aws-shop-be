# Base
FROM node:12-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

# Build
COPY ./src .
RUN npm run build

# Application
USER node
ENV PORT=8000
EXPOSE 8000

CMD ["node", "dist/main.js"]