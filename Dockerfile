# Use an official NGINX image
FROM nginx:alpine

# Copy the built Vue files into the NGINX default HTML folder
COPY dist /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
