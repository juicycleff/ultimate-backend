import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

const sessionMiddleware = session({
  secret: '46565-GHTJ-GHGGG-665655',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: { secure: false },
  name: 'session.app',
});
const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

export function authSetup(app: INestApplication) {
  app.use(sessionMiddleware);
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);
  app.use(cookieParser());

  // @ts-ignore
  app.set('subdomain offset', 1); // Enable sub domain in app
}
