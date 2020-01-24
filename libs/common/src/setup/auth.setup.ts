import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as useragent from 'express-useragent';
// import * as redis from 'redis';
// import * as connectRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as connectMongodbSession from 'connect-mongodb-session';
import { Express } from 'express';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

// const RedisStore = connectRedisStore(session);

// const client = redis.createClient();
// const store = new RedisStore({ client });

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const jestMongoDb = global.__MONGO_URI__ ? `${global.__MONGO_URI__}/${global.__MONGO_DB_NAME__}` : undefined;

const MongoDBStore = connectMongodbSession(session);

const store = new MongoDBStore({
  uri: jestMongoDb || `${AppConfig.mongodb.defaultUri}service-auth${AppConfig.mongodb.options}`,
  collection: 'session',
});

const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

export function authSetup(app: INestApplication | Express, withPassport: boolean = true) {

  const sessionMiddleware = session({
    secret: '46565-GHTJ-GHGGG-665655',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      // domain: 'localhost',
    },
    // proxy: withPassport === true ? undefined : true,
    store,
    name: 'session.app',
  });

  if (withPassport) {
    // @ts-ignore
    // app.set('trust proxy', 1);
    app.use(sessionMiddleware);
    app.use(useragent.express());
    app.use(passportMiddleware);
    app.use(passportSessionMiddleware);
  } else {
    app.use(cookieParser());
  }

  // @ts-ignore
  app.set('subdomain offset', 1); // Enable sub domain in app
}
