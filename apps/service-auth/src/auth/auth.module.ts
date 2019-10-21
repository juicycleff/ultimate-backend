import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { FacebookStrategy, LocalStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { CookieSerializer } from '@graphqlcqrs/common';
import { MongoModule } from '@juicycleff/nest-multi-tenant/database';
import { RepositoryModule } from '@graphqlcqrs/repository/repository.module';

@Module({
  imports: [
    RepositoryModule,
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, CookieSerializer, FacebookStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
