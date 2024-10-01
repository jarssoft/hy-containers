#FROM node:20
FROM node:20 AS build-stage 

WORKDIR /usr/src/app

ENV VITE_BACKEND_URL="http://localhost:3001/api/cities/"

COPY . .

RUN npm ci

RUN npm run build

#RUN npm test

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html