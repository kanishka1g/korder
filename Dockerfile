# Use the official Node.js image from the Docker Hub
FROM nginx:alpine

# Set the working directory in the container
COPY ./ /usr/share/nginx/html/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 80

# Define the command to run the app
CMD ["node", "app.js"]
