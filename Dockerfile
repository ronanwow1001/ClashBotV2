
### Dependency ###
FROM node:carbon

### App Creation ###
WORKDIR /usr/src/app

### Installation ###
COPY package*.json ./
RUN npm install

### Bundle Application ###
COPY . .

### Commands ###
CMD [ "npm", "start" ]
