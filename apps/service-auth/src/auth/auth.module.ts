import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FacebookStrategy, LocalStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { CookieSerializer } from '@graphqlcqrs/common';

@Module({
  providers: [AuthService, AuthResolver, LocalStrategy, CookieSerializer, FacebookStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
