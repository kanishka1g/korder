# Use Node.js for building Vue app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vue app
RUN npm run build

# Use Nginx to serve the built Vue app
FROM nginx:alpine

# Copy the built files to Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 3005

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
