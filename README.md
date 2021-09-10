<h1 align="center">  
ULTIMATE BACKEND  
</h1>  
    
<p align="center">  
  <bold>(WIP)</bold>: This is an enterprise scale advanced microservice pattern with GraphQL API and GRPC Microservices, based on Domain (DDD) using the command query responsibility segregation (CQRS) design pattern.
  Want to ask <a target="_blank" href="https://join.slack.com/t/ultimate-backend/shared_invite/zt-gd6kuuh2-B665Di4cRLqzVqXvhbmrHg">Rex Isaac Raphael</a> questions, join the slack channel :)
</p>  
    <p align="center">  
</p>  
  
<p align="center">
<img src="https://opencollective.com/ultimate-backend/tiers/sponsor/badge.svg?label=sponsor&color=brightgreen" />
<a href="https://img.shields.io/github/license/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/license/juicycleff/ultimate-backend?style=flat-square" alt="License"/></a>  
<a href="https://img.shields.io/snyk/vulnerabilities/github/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/snyk/vulnerabilities/github/juicycleff/ultimate-backend?style=flat-square" alt="Snyk"/></a>  
<a href="https://img.shields.io/github/languages/code-size/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/languages/code-size/juicycleff/ultimate-backend?style=flat-square" alt="Code Size"/></a>  
<a href="https://img.shields.io/github/package-json/v/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/package-json/v/juicycleff/ultimate-backend?style=flat-square" alt="Version"/></a>  
<a href="https://img.shields.io/github/languages/top/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/languages/top/juicycleff/ultimate-backend?style=flat-square" alt="Top Language"/></a>  
<a href="https://img.shields.io/codacy/grade/dc460840375d4ac995f5647a5ed10179?style=flat-square" target="_blank"><img src="https://img.shields.io/codacy/grade/dc460840375d4ac995f5647a5ed10179?style=flat-square" alt="Top Language"/></a>  
</p>  
  
## Description  
Note: The current boilerplate repo is here [WIP Ultimate Backend Boilerplate](https://github.com/juicycleff/ultimate-backend-boilerplate). This repo is currently houses the microservice packages [Next Branch](https://github.com/juicycleff/ultimate-backend/tree/next/packages).

This should be the go to backend base for your next scalable project. This is a proof of concept project designed to be extremely slim and scalable, with distributed data request and process handling, built from the ground up for production use. It comes with Multi-Tenancy SaaS support, following different multi-tenancy database strategy as well as different resolver patterns  
to identify your tenants. The goal is to give your next big project that extra leap to awesomeness. To get started read the instructions below. With support for both [Event Store](https://eventstore.org) and [NATS Streaming](https://nats.io) for event streaming and Kafka comming soon.
  
> **Note:** Seeing alot of clone of the project which is good, but please if you can 🌟 the project as it also motivates me in improving the project. Also the docker azure CI setups is broken and will be fixed soon.
> 
  
> **Note:** Also ultimate backend is coming to `rust` as a complete microservice framework, if you want to be part of it and you program in `rust`, please write to me. Here is the repo [ultimate](https://github.com/juicycleff/ultimate)
> 
## Features  
  
Software features  
  
* ✅ CQRS  
* ✅ Software as a Service  
* ✅ Authentication by stateful session (Password) GraphQL  
* ✅ OAuth2 Authentication (Google, Github, Facebook) REST  
* ✅ User  
* ✅ Event Sourcing  
* ✅ GraphQL API  
* ✅ GRPC Microservice  
* ✅ Emailing Queue  
* ✅ Role Based Access Control  
* ✅ Multi Tenancy  
* ✅ Payment ([Stripe](https://stripe.com/))  
* ✅ SaaS Plans ([Stripe](https://stripe.com/))  
* ✅ Security
* ✅ Service Discovery (Default on Consul), supports ectd, Kubernetes  
* ✅ [React SSR Starter Kit](https://github.com/juicycleff/ultimate-backend-dashboard)
* ❌ (WiP) Documentation  
* ✅ (WiP) Webhooks  
* ❌ (WiP) Support for language translation  
* ❌ (WiP) GraphQL dataloaders
  
## Software stack
  
  |                |Required                          |Optional                         |
|----------------|-------------------------------|-----------------------------|
|`Store and cache`|[Event Store (Event Source Store)](https://eventstore.org), [Redis (Queue & cache)](https://redis.io/) and [MongoDB (Database)](https://www.mongodb.com/)            |[ArangoDB (Database)](https://www.arangodb.com/), [NATS Streaming (Event Source Store)](https://nats.io)            |
|`Stack and frameworks` |[NestJS (Server Framework)](https://nestjs.com), [NodeJS (System runtime)](https://nodejs.org), [Typescript](https://www.typescriptlang.org), [Express JS](https://expressjs.com), [Fastify](https://www.fastify.io), [GRPC](https://grpc.io/), [NestCloud](https://nestcloud.org/) and [Apollo GraphQL](https://www.apollographql.com)                |none            |
|`Deployment and containerization`          |[Docker](https://www.docker.com/) |[Kubernetes](https://kubernetes.io/), [Azure Pipeline](https://azure.microsoft.com/en-us/services/devops/pipelines/), GitLab CI ||
|`Service Registry`          |[Consul](https://consul.io/)|[Kubernetes](https://kubernetes.io/) and [etcd](https://etcd.io/)|
  

## Folder Structure  
Senior candidate in the folder structure is the `/app` folder. This folder contains all executable programs or in this case microservices

 - `/app/service-access` The access microservice handles access token management for each tenant in the system. It also validates current tenant credentials against a tenant specific resources. It is the gate keeper for your tenant api.
 - `/app/service-account` The account microservice handles user account commands and queries such as creating and validating new and current users in the system.
 - `/app/service-tenant` The tenant microservice handles creating new tenants as well as managing tenant specific commands and queries.
 - `/app/service-role` Similar to service-access, this service validates users based on roles against the entire system and tenants they belong to. This service handles only user authorization, where service-access is for tenant access keys for external api.
 - `/app/service-notification` The microservice performs notification tasks in the entire systems. Right now it supports emailing, but can be extended to support push notification as well as activity feeds.
 - `/app/service-billing` The billing microservice manages billing and payment commands. It is tightly integrated with Stripe, but can be easily replaced.
 - `/app/service-project` This microservice is merely an example of supporting multi-tenant database strategy. It holds no other significance.

The next important folder is the  `/lib` folder. This folder contains all internal libraries that is depended upon by the microservices, and they are,
 - `/lib/common` House shared/common modules in the project.
 - `/lib/core` This is the core module of ultimate backend and houses most of the codebase that wires everything together.
 - `/lib/repo-orm` This library will be extracted in the future as it matures. It is aimed at being a simple, less cluttered NoSQL multi-tenant object relational mapper (ORM), It supports caching, MongoDB and ArangoDB, with support for FaunaDB in the works.
 - `/lib/contracts` Shared contracts for both typescript typings and graphql code first types, are stored here.
 - `/lib/repository` It holds all repositories used in the microservices, and this repository and created from the repo-rom library.
 - `/lib/proto-schema` All GRPC protobuf files required by each service, is stored in here and shared amongst services that depends on them.
  
  Other folders such as `iac` which simply means Infrastructure as Code is teraform setup for creating a kubernetes cluster with just a simple command for running the microservices. `scripts` contains helper bash scripts for CI/CD.
  
## Installation  
  
```bash  
$ yarn install
```  
  
## Configuration  
  
Before starting the services, please create the appropriate consul (Default service registry Consul) kv store config for all the services. You can find the example config  
in the folders of each service called `config.example`. The consul config key of say the `account service` should be  
`ultimatebackend/config/io.ultimatebackend.srv.account` and just paste the config.yaml content in the consul store for that key in yaml and save.  
You will need to set your sendgrid api key, so the backend can send emails on signup etc. If using stripe for payments you'll also need to put your public and private keys there too.  
You can opt in for `etcd` or `kubernetes` as `service registry`.  
  
## Usage  

### With Docker locally
```bash
$ docker-compose --project-directory=. -f docker-compose.dev.yml up --build
```

> **Note:** I've seen some issues with consul docker image and so would recommend setting up consul manually before running this command
> 
  
### Without Docker locally 
  
Consul, Mongodb, redis, memcached, and eventstore all need to be started first as our microservices need to connect to them.  
  
Start consul locally  
```bash  
consul agent --dev  
```
For help installing consul on your local machine, visit [Consul Website](https://consul.io/)
  
Start mongodb locally  
```bash  
mongod  
```  
  
If you have docker installed  
```bash  
docker run -d -p 27017:27017 mongo  
docker run -d -p 1113:1113 -p 2113:2113 eventstore/eventstore --insecure # insecure flag specifies no certificate required - suitable for devmode 
docker run -d -p 6379:6379 redis  
```  
  
Otherwise, you can install and run redis and eventstore locally if you choose.  
  
### Running the microservices  
You should start the microservices in any other. Example  
  
```bash
  
# Generate protobuf typescript definitions and please fix the path for timestamps import (You should do this only when you update the protobuf files)
# and also build the proto-scheme lib (You should do this only when you update the protobuf files)
# in `lib/proto-schem`
# Also adds configuration(config.example files) to consul K/V registry (consul need to be running)
# You need jq and yq programs to use it   
$ yarn setup:local
  
# Start the account service  
$ npx nest start service-account  
  
# Start the access service  
$ npx nest start service-access  
  
# Start the role service  
$ npx nest start service-role  
  
# Start the graphql api  
$ npx nest start api-admin  
  
```  
> **Note:** You don't need all services running plus you can start them in any order.
  
### Alternative method of running services  
  
If you find the nest cli using too much memory running each service, you can build them first and then run them:  
  
Build each service:  
```bash  
npx nest build service-account  
npx nest build service-notification  
npx nest build service-billing  
npx nest build service-project  
npx nest build service-tenant  
npx nest build service-access  
npx nest build service-role  
```  
  
Each service is built and written into dist/apps directory from where you can directly run each service with nodejs. Running each service with ```npx nest start``` uses three orders of magnitude more memory than this method so you will use a lot less memory!  
  
Run each service in a separate terminal:  
```bash  
node dist/apps/service-account/main.js  
node dist/apps/service-notification/main.js  
node dist/apps/service-billing/main.js  
node dist/apps/service-project/main.js  
node dist/apps/service-tenant/main.js  
node dist/apps/service-access/main.js  
```  
  
With the databases and the services running you can now start the gateways as mentioned above.  
  
```bash  
yarn start:dev api-admin  
```  
  
## Get started by registering a user on the admin gateway  
  
In the graphql playground running at http://localhost:4000//graph you can register a user:  
  
```graphql  
mutation register {  
  account {  
    register(input:{  
        firstname: "Alice"  
        lastname: "Bob"  
        email: "AliceBobsEmail@protonmail.com"  
        password: "supersecretpassword"  
    }) {  
      token  
    }  
  }  
}  
```  
  
All going well you should have received the following reply as well as an email with a verification code as well as a jwt token that contains both email and verification code for your frontend  
  
```  
{  
    "data": {  
        "account": {  
            "register": {  
                "token": "gtdjghdrtd65edjhc-chxgfxjtgzrkzxyzxtrs45wi6kydch"  
            }  
        }  
    }  
}  
```  
  
## Quick Tips  
  
#### Generating dynamic mongo filter GraphQL type.  
You can generate dynamic graphql filter by decorating the fields you want to be  
avaiable in your generated filter type with the `@Filterable()` decorator like below  
  
  
```typescript  
import { Filterable } from '@ultimatebackend/core';  
  
@ObjectType()  
export class Tenant extends Node {  
  
  @Filterable()  
  @Field({ nullable: true })  
  name: string;  
  
  @Filterable()  
  @Field({ nullable: true })  
  normalizedName: string;  
}  
```  
  
After adding decorator to the fields you can now add generate your graphql input type.
> **Note:** Enums and sub-types not supported at the moment.
  
```typescript  
import { FilterMongo } from '@ultimatebackend/contracts';  
  
@InputType()  
export class TenantFilterInput extends FilterMongo(Tenant, { simple: true }) {}  
```  
  
#### Multi-tenant Database for services.  
You can enable multi-tenant database support in your micro-service by adding this
```typescript
MongoModule.registerAsync({  
 useClass: MongoMultiTenantConfigService,  
})
```
code block to the service app module. For example;

```typescript  
import { Module } from '@nestjs/common';  
import { MongoModule } from '@juicycleff/repo-orm/database';  
import { MongoMultiTenantConfigService } from '@ultimatebackend/core/mutiltenancy';  
  
@Module({  
  imports: [
    // ...
    MongoModule.registerAsync({  
      useClass: MongoMultiTenantConfigService,  
    }),
    // ...
  ],  
})  
export class AppModule {}  
```  
A good example is the `service-project` microservice.

Next you must enable multi-tenancy in the  `main.ts` file of the `api-admin` service or any other api type microservice you create in your project.  
  
```typescript  
import { NestFactory } from '@nestjs/core';  
import { NestCloud } from '@nestcloud/core';  
import { AppModule } from './app.module';  
import { enableMultiTenancy, TenantDatabaseStrategy } from '@ultimatebackend/core/mutiltenancy';  
  
async function bootstrap() {  
  const app = NestCloud.create(await NestFactory.create(AppModule));  
  
  app.use(enableMultiTenancy({  
    enabled: true,  
    tenantResolver: {  
      resolverType: 'Header',  
      headerKeys: {  
        tenant: 'x-tenant-id',  
        apiKey: 'x-tenant-key',  
      },  
      requiresToken: true,  
    },  
    databaseStrategy: TenantDatabaseStrategy.DataIsolation,  
  }));  
  
  // ..... code continues  
}  
  
```  
  
#### Access token with scopes  
Access tokens scopes just a combination of action and resource identifier. For example, take this mutation;
```typescript
  @UseGuards(GqlAuthGuard)
  @Resource({ name: 'billing', identify: 'billing:card', roles: ['customer'], action: 'update' })
  @ResolveField(() => Card)
  async create(@Args('input') input: CreateCardInput, @Context() ctx: GqlContext): Promise<Card> {
    // @ts-ignore
    const result = await this.service.billing.createCard({...input}, setRpcContext(ctx)).toPromise();
    return result.card;
  }
```
Your access token scope will be `update_billing:card` and so your mutation to create an access token should look like this

```graphql
mutation {
  accessToken {
    create(input: {
      name: "my-superb-token",
      scopes: ["update_billing:card"]
    }) {
      token
      id
      name
      active
    }
  }
}
``` 
That's all you need to know when creating access token which should be used together with your tenant normalized name to access the API
without a logged in user.

#### More docs updates coming.  
  
## Test  
  
```bash  
# unit tests  
$ yarn run test  
  
# e2e tests  
$ yarn run test:e2e  
  
# test coverage  
$ yarn run test:cov  
```  

### Financial Contributors
Become a financial contributor. Your funds go to; people in need [[Contribute](https://opencollective.com/ultimate-backend/contribute)]

#### Backers

<a href="https://opencollective.com/ultimate-backend"><img src="https://opencollective.com/ultimate-backend/backer.svg?width=890"></a>

#### Sponsors

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/ultimate-backend/contribute)]

<a href="https://opencollective.com/ultimate-backend/sponsor/0/website"><img src="https://opencollective.com/ultimate-backend/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/1/website"><img src="https://opencollective.com/ultimate-backend/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/2/website"><img src="https://opencollective.com/ultimate-backend/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/3/website"><img src="https://opencollective.com/ultimate-backend/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/4/website"><img src="https://opencollective.com/ultimate-backend/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/5/website"><img src="https://opencollective.com/ultimate-backend/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/6/website"><img src="https://opencollective.com/ultimate-backend/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/7/website"><img src="https://opencollective.com/ultimate-backend/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/8/website"><img src="https://opencollective.com/ultimate-backend/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/ultimate-backend/sponsor/9/website"><img src="https://opencollective.com/ultimate-backend/sponsor/9/avatar.svg"></a>

## My Other Projects  
  
  Here are some of my projects, show some love and start them if you find them helpful :)
  
 - [nestjs-event-store](https://github.com/juicycleff/nestjs-event-store)
 - [casbin-mongodb-adapter](https://github.com/juicycleff/casbin-mongodb-adapter)
 - [nestjs-casbin](https://github.com/juicycleff/nestjs-casbin)
 - [flutter-unity-view-widget](https://github.com/snowballdigital/flutter-unity-view-widget)
  
## Special Thanks  
  
  This project wouldn't be possible without these two awesome projects,
  [NestJS (Server Framework)](https://nestjs.com) and [NestCloud](https://nestcloud.org/), please make sure to Star them.
  
## License  
  
  This project is [MIT licensed](LICENSE).
