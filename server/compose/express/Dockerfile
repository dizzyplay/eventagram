FROM node:lts

WORKDIR /app
RUN npm install -g yarn
ADD compose/express/start.sh /start.sh
RUN chmod +x /*.sh
