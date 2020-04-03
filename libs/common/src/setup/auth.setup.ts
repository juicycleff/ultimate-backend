import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as useragent from 'express-useragent';
import * as cookieParser from 'cookie-parser';
import * as connectMemcached from 'connect-memcached';
import { Express } from 'express';

const MemcachedStore = connectMemcached(session);

const store = new MemcachedStore({
  hosts: ['127.0.0.1:11211'],
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
