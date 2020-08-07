import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  Logger,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Strategy } from 'passport-google-oauth';
import { AccountsService } from '../accounts.service';
import { InjectConfig } from '@nestcloud/config';
import { EtcdConfig } from '@nestcloud/config/etcd-config';
import {
  LoginServiceTypes,
  LoginRequest,
  CreateRequest,
} from '@ultimatebackend/proto-schema/account';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
  logger = new Logger(this.constructor.name);

  constructor(
    @InjectConfig() private readonly config: EtcdConfig,
    private readonly accountService: AccountsService,
  ) {
    super({
      clientID: config.get<string>('app.auth.strategies.google.clientID'),
      clientSecret: config.get<string>(
        'app.auth.strategies.google.clientSecret',
      ),
      callbackURL: config.get<string>('app.auth.strategies.google.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken, refreshToken, profile, done): Promise<any> {
    if (profile && profile.emails.length > 0) {
      const logCmd: LoginRequest = {
        service: LoginServiceTypes.Google,
        params: {
          accessToken,
          userId: profile.id,
          email: profile.emails[0].value,
          password: undefined,
        },
      };

      const regCmd: CreateRequest = {
        service: LoginServiceTypes.Google,
        tokens: {
          accessToken,
          userId: profile.id,
        },
        email: profile.emails[0].value,
        firstname: profile?.name?.givenName,
        lastname: profile?.name?.familyName,
        password: undefined,
        username: profile.username,
      };

      const user = await this.accountService.validateOrCreateUser(
        logCmd,
        regCmd,
      );

      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
    throw new NotImplementedException();
  }
}
