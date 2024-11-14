# Use an official Node.js image as the base
FROM node AS builder

# Set working directory
WORKDIR /usr/src/app

RUN npm config set strict-ssl false

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies for building
RUN npm ci

# Copy the rest of the app's source code
COPY . .

# Build the app
RUN npm run build

# Use a smaller base image for the final build
FROM node:slim

# Set environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app
# Copy only production dependencies from the builder stage
COPY package*.json ./
RUN npm config set strict-ssl false

RUN npm ci --production

# Copy the build from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port
EXPOSE 3000
# Run the app
CMD ["node", "dist/index.js"]
