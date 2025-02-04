# Use Nginx to serve the built Vue app
FROM nginx:alpine

# Copy built Vue files to Nginx public directory
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 3006

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
