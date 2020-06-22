FROM node:10.15

RUN mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build

EXPOSE 3006

CMD npm run start