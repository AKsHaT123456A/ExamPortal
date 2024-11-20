# Use an official Node.js image as the base
FROM node AS builder

# Set working directory
WORKDIR /usr/src/app


# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm config set strict-ssl false
# Install dependencies for building
RUN npm install 
# Copy the rest of the app's source code
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000
# Run the app
CMD ["node", "dist/index.js"]
