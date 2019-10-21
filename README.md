<h1 align="center">
ULTIMATE BACKEND
</h1>
  
<p align="center">
  This is an enterprise scale advanced microservice pattern with GraphQL, based on Domain  (DDD) using the command query responsibility segregation (CQRS) design pattern. This is a proof of concept project designed to be extremly slim and scalable, with distributed data request and process handling and built from the ground up for production use.
</p>
    <p align="center">
</p>

## Description
You can clone and test it out. Working as is with authentication using Stateles JWT pattern. I will be updating the readme with proper guidelines on how to use 

## Installation

```bash
$ yarn bootstrap
```

## System

### The Problem

### System Architecture & Design

### System requirements

### System Benefits

### Requirements

List of required data, event store and cache systems
 - [x] [Event Store (Event Source datastore)](https://eventstore.org)
 - [x] [Redis (For cache database calls and graphql queries)](https://redis.io/)
 - [x] [CoackroachDB (Database, can be easily replaced)](https://www.cockroachlabs.com/)

System stack and frameworks
 - [x] [TypeORM](https://typeorm.io)
 - [x] [NodeJS (System runtime)](https://nodejs.org)
 - [x] [Typescript](https://www.typescriptlang.org)
 - [x] [Apollo Server](https://www.apollographql.com/docs/apollo-server)
 - [x] [NestJS (Server Framework)](https://nestjs.com)
 - [x] [Apollo Gateway](https://www.apollographql.com/docs/apollo-server/federation/introduction)
 - [x] [Express JS](https://expressjs.com)
 - [x] [Fastify](https://www.fastify.io)

Containerization and deployment stack.
 - [x] [Docker](https://www.docker.com/)
 - [x] [Kubernetes](https://kubernetes.io/)
 - [x] [Azure Pipeline](https://azure.microsoft.com/en-us/services/devops/pipelines/)


## Running the auth microservice app

```bash
# development for auth microservice
$ yarn run run:service:auth

# watch mode
$ yarn run run:service:auth:dev

# production mode
$ yarn run run:service:auth:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Features
Software features

 - [x] CQRS
 - [x] Authentication by stateless JWT
 - [x] User
 - [x] Event Sourcing
 - [x] Federated GraphQL Microservice
 - [x] Emailing Queue
 - [ ] Authentication by session
 - [ ] RBAC
 - [ ] Security
 - [ ] Multi Tenancy
 - [ ] React Website

## License

  This project is [MIT licensed](LICENSE).
