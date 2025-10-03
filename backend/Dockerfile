FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

RUN cd backend && npm install

COPY backend ./backend

COPY deploy.sh ./deploy.sh
RUN chmod +x ./deploy.sh

CMD ["node", "backend/src/server.js"]
EXPOSE 5000
