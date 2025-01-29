# Stage 1: Build the Vue 3 project
FROM node:18 AS build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vue 3 project
RUN npm run build

# Stage 2: Serve the built files using nginx
FROM nginx:alpine AS production-stage

# Copy the built files from the build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]