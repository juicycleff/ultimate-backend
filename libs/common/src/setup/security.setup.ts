import { INestApplication } from '@nestjs/common';
// import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { Express } from 'express';

export function securitySetup(app: INestApplication | Express) {
  // app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 15 minutes
      max: 20, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(helmet());
}
