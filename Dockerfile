# Use Nginx to serve the built Vue app
FROM nginx:alpine

# Copy built Vue files to Nginx public directory
COPY dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
