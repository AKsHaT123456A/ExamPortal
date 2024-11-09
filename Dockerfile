FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN  npm ci

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]