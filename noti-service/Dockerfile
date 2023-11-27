FROM node

WORKDIR /developer/nodejs/noti-service

COPY . .

RUN npm ci

CMD [ "npm", "run", "dev" ]