FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./src/prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]