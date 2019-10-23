FROM node:current-alpine
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install -g @nestjs/cli
RUN npm install rimraf -g
RUN yarn

COPY . /usr/src/app

EXPOSE 4000
CMD ["yarn", "start", "gateway-admin"]
