FROM node:12-alpine
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /usr/src/app
ADD . /usr/src/app

WORKDIR /usr/src/app

RUN yarn global add @nestjs/cli

RUN yarn install --production=false

RUN yarn global add rimraf
RUN yarn global add @nestjs/cli

# Build production files
RUN nest build proto-schema
RUN nest build service-access

# Bundle app source
COPY . .

EXPOSE 50089
CMD ["node", "dist/apps/service-access/main.js"]
