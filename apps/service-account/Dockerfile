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

# Build production files
RUN nest build proto-schema
RUN nest build service-account

# Bundle app source
COPY . .

EXPOSE 50054
CMD ["node", "dist/apps/service-account/main.js"]
