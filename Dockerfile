# Stage 1: Build the Vue 3 app with Vite
FROM node:lts-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build it
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine AS production
# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# (Optional) Copy a custom Nginx config to handle routing and custom port
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3006 for the server
EXPOSE 3006
# Start Nginx in the foreground (daemon off)
CMD ["nginx", "-g", "daemon off;"]
