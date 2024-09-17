FROM node:20

WORKDIR /usr/src/app

ENV VITE_BACKEND_URL="http://localhost:3000/"

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]

#RUN npm run build
#RUN npm install -g serve
#CMD ["serve", "dist", "--no-clipboard"]