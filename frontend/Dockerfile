FROM node:alpine

RUN mkdir -p /opt/app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

WORKDIR /opt/app
COPY package.json /opt/app
COPY yarn.lock /opt/app
RUN yarn install

COPY . /opt/app

CMD ["yarn","dev"]