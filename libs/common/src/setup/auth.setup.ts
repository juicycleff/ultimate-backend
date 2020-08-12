import { INestApplication, Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redis from 'redis';
import * as useragent from 'express-useragent';
import * as cookieParser from 'cookie-parser';
import * as connectRedis from 'connect-redis';
import { Express } from 'express';
import { NestCloud } from '@nestcloud/core';

// tslint:disable-next-line:no-var-requires
const parseIsoDuration = require('parse-iso-duration');

const RedisStore = connectRedis(session);

// @ts-ignore
export const passportMiddleware = passport.initialize();
export const passportSessionMiddleware = passport.session();

// @ts-ignore
export function getSessionStoreMiddleware() {
  const redisConfig: redis.ClientOpts = NestCloud.global.boot.get(
    'redis',
    {},
  );
  const authConfig: {
    sessionKey?: string;
    sessionSecret?: string;
    domain?: string;
    resave?: boolean;
    rolling?: boolean;
    saveUninitialized?: boolean;
    cookieMaxAge?: string;
    secure?: boolean;
  } = NestCloud.global.boot.get('app.auth', {});
  if (redisConfig?.password === '') {
    delete redisConfig.password;
  }
  // redis init
  const redisClient = redis.createClient({
    ...redisConfig,
  });
  const store = new RedisStore({ client: redisClient });

  // sessions
  return session({
    secret: authConfig.sessionSecret,
    resave: Boolean(authConfig?.resave),
    rolling: Boolean(authConfig?.rolling),
    saveUninitialized: false,
    cookie: {
      maxAge: parseIsoDuration('PT' + authConfig.cookieMaxAge),
      secure: Boolean(authConfig?.secure),
      domain: authConfig?.domain,
    },
    // proxy: withPassport === true ? undefined : true,
    store,
    name: authConfig.sessionKey,
  });
}

export function authSetup(
  app: INestApplication | Express,
  withPassport: boolean = true,
) {
  try {
    // sessions
    const sessionMiddleware = getSessionStoreMiddleware();

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
  } catch (e) {
    Logger.log(e, 'auth.setup');
  }
}
