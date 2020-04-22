FROM node:12-alpine AS proto-build

WORKDIR /nest

# Install dependencies
ADD *.json yarn.lock ./
RUN yarn install

# Build library files
ADD definitions definitions
ADD libs libs
RUN yarn build proto-schema

FROM proto-build AS build

ADD apps/service-account apps/service-account
RUN yarn build service-account

# Bundle app source
FROM node:12-alpine

WORKDIR /nest

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ADD package.json yarn.lock ./
RUN yarn install

COPY --from=proto-build /nest/dist/libs/proto-schema /libs/proto-schema
COPY --from=build /nest/dist/apps/service-account .

EXPOSE 50054
CMD ["node", "/nest/main.js"]
