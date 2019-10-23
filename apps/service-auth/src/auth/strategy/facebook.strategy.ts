import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'FACEBOOK_APP_ID',
      clientSecret: 'FACEBOOK_APP_SECRET',
      callbackURL: 'http://localhost:9900/auth/facebook/callback',
    });
  }

  async validate(): Promise<any> {
    // TODO: implement this
    throw new NotImplementedException();
  }
}
