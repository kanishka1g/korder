# Use a lightweight web server image
FROM nginx:alpine

# Copy your HTML files to the default web root
COPY ./ /usr/share/nginx/html/

# Expose port 80
EXPOSE 3000
