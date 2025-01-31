# Stage 1: Build the Vue application
FROM node:18 AS build-stage
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production environment
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Copy built assets from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 (matching your proxy_pass port 8080 on host)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]