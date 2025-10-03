FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

COPY ../test.sh ./test.sh

RUN chmod +x ./test.sh

CMD ["node", "src/server.js"]

EXPOSE 5000
