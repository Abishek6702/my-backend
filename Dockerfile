# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend codebase
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the backend server
CMD ["npm", "start"]
