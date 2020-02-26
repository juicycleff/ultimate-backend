<h1 align="center">
ULTIMATE BACKEND
</h1>
  
<p align="center">
  <bold>(WIP)</bold>: This is an enterprise scale advanced microservice pattern with GraphQL, based on Domain  (DDD) using the command query responsibility segregation (CQRS) design pattern.
</p>
    <p align="center">
</p>

<p align="center">
<a href="https://img.shields.io/github/license/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/license/juicycleff/ultimate-backend?style=flat-square" alt="License"/></a>
<a href="https://img.shields.io/snyk/vulnerabilities/github/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/snyk/vulnerabilities/github/juicycleff/ultimate-backend?style=flat-square" alt="Snyk"/></a>
<a href="https://img.shields.io/github/languages/code-size/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/languages/code-size/juicycleff/ultimate-backend?style=flat-square" alt="Code Size"/></a>
<a href="https://img.shields.io/github/package-json/v/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/package-json/v/juicycleff/ultimate-backend?style=flat-square" alt="Version"/></a>
<a href="https://img.shields.io/github/languages/top/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/languages/top/juicycleff/ultimate-backend?style=flat-square" alt="Top Language"/></a>
<a href="https://img.shields.io/codacy/grade/dc460840375d4ac995f5647a5ed10179?style=flat-square" target="_blank"><img src="https://img.shields.io/codacy/grade/dc460840375d4ac995f5647a5ed10179?style=flat-square" alt="Top Language"/></a>
</p>

## Description

This should be the go to backend base for your next scalable project. This is a proof of concept project designed to be extremely slim and scalable, with distributed data request and process handling, built from the ground up for production use. It comes with Multi-Tenancy SaaS support, following different multi-tenancy database strategy as well as different resolver patterns
to identify your tenants. The goal is to give your next big project that extra leap to awesomeness. To get started read the instructions below

## Features

Software features

*   ✅ CQRS
*   ✅ Software as a Service
*   ✅ Authentication by stateful session
*   ✅ User
*   ✅ Event Sourcing
*   ✅ Federated GraphQL Microservice
*   ✅ Emailing Queue
*   ✅ (WiP) Role Based Access Control
*   ✅ Multi Tenancy
*   ✅ Payment ([Stripe](https://stripe.com/))
*   ✅ SaaS Plans ([Stripe](https://stripe.com/))
*   ✅ (WiP) Security
*   ❌ (WiP) Documentation
*   ❌ (WiP) Support for language translation
*   ❌ Reactive health check for federated service and rebuilding gateway schema
*   ❌ Service Discovery (Based on Consul)
*   ✅ [React SSR Starter Kit](https://github.com/juicycleff/ultimate-backend-dashboard)

## Requirements

| Store and Cache                                            | Stack and frameworks                                                                       | Deployment                                                                     |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| [Event Store (Event Source Store)](https://eventstore.org) | [NestJS (Server Framework)](https://nestjs.com)                                            | [Docker](https://www.docker.com/)                                              |
| [Redis (cache)](https://redis.io/)                         | [NodeJS (System runtime)](https://nodejs.org)                                              | [Kubernetes](https://kubernetes.io/)                                           |
| [MongoDB (Database)](https://www.mongodb.com/)             | [Typescript](https://www.typescriptlang.org)                                               | [Azure Pipeline](https://azure.microsoft.com/en-us/services/devops/pipelines/) |
| [ArangoDB (Database)](https://www.arangodb.com/)           | [Apollo Server](https://www.apollographql.com/docs/apollo-server)                          |                                                                                |
|                                                            | [Express JS](https://expressjs.com)                                                        |                                                                                |
|                                                            | [Apollo Gateway](https://www.apollographql.com/docs/apollo-server/federation/introduction) |                                                                                |                                                                               |
|                                                            | [Fastify](https://www.fastify.io)                                                          |                                                                                |                                                                               |
|                                                            | [GRPC](https://grpc.io/)                                                                   |                                                                                |

## Installation

```bash
$ yarn
```

## Configuration

In the config directory there are yaml files with defaults set for many things such as mongodb url and ports for services. However you will need to set your sendgrid api key so the backend can send emails on signup etc. If using stripe for payments you'll also need to put your public and private keys there too.

## Usage

### Running the databases

Mongodb, redis, and eventstore all need to be started first as our microservices need to connect to them.

Start mongodb locally
```bash
mongod
```

If you have docker installed
```bash
docker run -d -p 27017:27017 mongo
docker run -d -p 1113:1113 -p 2113:2113 eventstore/eventstore
docker run -d -p 6379:6379 redis
```

Otherwise you can install and run redis and eventstore locally if you choose.

### Running the microservices

You should start the microservices of type service before the gateways. Example

```bash

# Start with staging environment for auth service
$ NODE_ENV=staging npx nest start service-auth

# Start with staging environment for user service
$ NODE_ENV=staging npx nest start service-user

# Start with testing environment for tenant service
$ NODE_ENV=testing npx nest start service-tenant

# Start with testing environment for payment service
$ NODE_ENV=testing npx nest start service-payment

# Start with testing environment for notification service
$ NODE_ENV=testing npx nest start service-notification

# Start with testing environment for project service
$ NODE_ENV=testing npx nest start service-project
```

Once all services are up and running, you can start the gateways
```bash

# development for admin gateway
$ yarn run start gateway-admin

# watch mode for admin gateway
$ yarn run start:dev gateway-admin

# development for client gateway
$ yarn run start gateway-client

# watch mode for client gateway
$ yarn run start:dev gateway-client

# production mode for admin gateway
$ yarn run start:prod

```

### Alternative method of running services

If you find the nest cli using too much memory running each service, you can build them first and then run them:

Build each service:
```bash
npx nest build service-auth
npx nest build service-notification
npx nest build service-payment
npx nest build service-project
npx nest build service-tenant
npx nest build service-user
```

Each service is built and written into dist/apps directory from where you can directly run each service with nodejs. Running each service with ```npx nest start``` uses three orders of magnitude more memory than this method so you will use a lot less memory!

Run each service in a separate terminal:
```bash
node dist/apps/service-auth/main.js
node dist/apps/service-notification/main.js
node dist/apps/service-payment/main.js
node dist/apps/service-project/main.js
node dist/apps/service-tenant/main.js
node dist/apps/service-user/main.js
```

With the databases and the services running you can now start the gateways as mentioned above.

```bash
yarn start:dev gateway-admin
yarn start:dev gateway-client
```

## Get started by registering a user on the admin gateway

In the graphql playground running at http://localhost:4000/graphql you can register a user:

```graphql
mutation register {
  register(input:{
    firstname: "Alice"
    lastname: "Bob"
    email: "AliceBobsEmail@protonmail.com"
    password: "supersecretpassword"
  }) {
    success
  }
}
```

All going well you should have received the following reply as well as an email with a verification code

```
{
    "data": {
        "register": {
            "success": true
        }
    }
}
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```



## License

  This project is [MIT licensed](LICENSE).
