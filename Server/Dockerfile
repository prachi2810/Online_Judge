FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ openjdk11 python3
COPY package.json .
RUN npm i
COPY . . 
EXPOSE 5137
CMD ["node","app.js"] 
