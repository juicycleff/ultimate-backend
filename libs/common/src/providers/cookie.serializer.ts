import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class CookieSerializer extends PassportSerializer {
  serializeUser(user: any, done: (a: any, b: any) => void): any {
    done(null, user);
  }

  deserializeUser(payload: any, done: (a: any, b: any) => void): any {
    done(null, payload);
  }
}
