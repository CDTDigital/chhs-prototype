#nodejs on Alpine
FROM mvertes/alpine-mongo

ENV NODE_ENV_PORT_NUM 80

EXPOSE 80

WORKDIR /usr/src/app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh nodejs

#RUN git clone https://github.com/theifishgroup/chhs-prototype.git
RUN mkdir chhs-prototype
WORKDIR chhs-prototype
RUN mkdir ifish_modules
COPY ifish_modules ifish_modules
RUN mkdir public
COPY public public
COPY *.js ./
COPY package.json ./

RUN npm install

CMD ["npm", "start"]
