FROM node:stretch
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=staging
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN yarn global add rimraf
RUN yarn

COPY . /usr/src/app

# Build production files
RUN yarn build gateway-admin

EXPOSE 4000

CMD ["node", "dist/apps/gateway-admin/main.js"]
