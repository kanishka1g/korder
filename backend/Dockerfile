FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Run your app from src/server.js
CMD ["npm", "run", "inspect"]

EXPOSE 5000
