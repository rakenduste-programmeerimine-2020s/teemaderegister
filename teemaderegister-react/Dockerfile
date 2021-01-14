FROM node:14.3-alpine

ENV HOME=/home/node

RUN chmod -R 777 /home/node

USER node

RUN mkdir -p $HOME/app
WORKDIR $HOME/app

RUN chmod -R 777 $HOME

COPY . $HOME/app

USER root

RUN npm install && \
    npm cache clean --force

ENTRYPOINT ["npm"]
CMD ["start"]

EXPOSE 3446
