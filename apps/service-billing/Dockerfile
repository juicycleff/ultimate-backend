FROM node:12-alpine
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /nest
ADD . /nest

WORKDIR /nest

RUN yarn global add @nestjs/cli

RUN yarn install --production=false

# Build production files
RUN nest build proto-schema
RUN nest build service-billing

# Bundle app source
COPY . .

EXPOSE 50067
CMD ["node", "dist/apps/service-billing/main.js"]
