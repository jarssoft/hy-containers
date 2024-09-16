FROM node:20

WORKDIR /usr/src/app

ENV VITE_BACKEND_URL="http://localhost:3000/"

COPY . .

RUN npm ci

RUN npm run build

RUN npm install -g serve

CMD ["serve", "dist", "--no-clipboard"]