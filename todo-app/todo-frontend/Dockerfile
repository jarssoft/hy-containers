FROM node:20

WORKDIR /usr/src/app

#ENV VITE_BACKEND_URL="http://localhost:3000/"
ENV VITE_BACKEND_URL="http://localhost:8080/api/"

COPY . .

RUN npm ci

RUN npm run build

RUN npm test

RUN npm install -g serve

CMD ["serve", "dist", "--no-clipboard"]