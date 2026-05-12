# Start from an official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (so Docker can cache the npm install layer)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Tell Docker this container listens on port 5000
EXPOSE 5000

# Command to start the app
CMD ["node", "src/index.js"]