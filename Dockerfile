FROM node:latest

# Create node directory
RUN mkdir /sev
WORKDIR /sev

# COPY file
COPY Dockerfile /sev
COPY package.json /sev
COPY ./src /sev/src

# Install app dependencies
RUN npm install -g forever && npm install --production

CMD npm run pro
