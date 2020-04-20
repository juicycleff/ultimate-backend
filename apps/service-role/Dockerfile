FROM node:12-alpine
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /nest
ADD . /nest

WORKDIR /nest

RUN yarn install
# Build production files
RUN yarn build proto-schema
RUN yarn build service-role

# Bundle app source
COPY . .

EXPOSE 50052
CMD ["node", "dist/apps/service-role/main.js"]
