FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build
