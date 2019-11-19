import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as useragent from 'express-useragent';
import * as connectMongodbSession from 'connect-mongodb-session';
import { AppConfig } from '../services/yaml.service';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const MongoDBStore = connectMongodbSession(session);

const store = new MongoDBStore({
  uri: `${process.env.MONGO_DB_SERVER_URI + 'service-auth'}` || 'mongodb://localhost:27017/test',
  collection: 'session',
});

const sessionMiddleware = session({
  secret: '46565-GHTJ-GHGGG-665655',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
    domain: AppConfig.app.url,
  },
  unset: 'destroy',
  store,
  name: 'session.app',
});
const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

export function authSetup(app: INestApplication) {
  app.use(sessionMiddleware);
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);
  app.use(cookieParser());
  app.use(useragent.express());

  // @ts-ignore
  app.set('subdomain offset', 1); // Enable sub domain in app
}
