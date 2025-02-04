FROM node:14.19-alpine3.15
RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "start"]