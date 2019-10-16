import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

const sessionMiddleware = session({
  secret: '46565-GHTJ-GHGGG-665655',
  resave: false,
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
  // app.set('trust proxy', 1) // trust first proxy
}
