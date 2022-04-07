FROM node

WORKDIR /usr/src/app

COPY express/ .
COPY express/package.json .
COPY express/config.json .

RUN yarn
RUN yarn global add pm2

EXPOSE 3000

# CMD [ "pm2-runtime", "start", "config.json" ]
CMD [ "yarn", "start"]
