FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build




FROM nginx:stable-alpine

COPY Docker/nginx/prod_nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /etc/nginx/dist
