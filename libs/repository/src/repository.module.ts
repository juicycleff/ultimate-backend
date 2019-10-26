import { CacheModule, Module } from '@nestjs/common';
import { UserRepository, AuthRepository } from '@graphqlcqrs/repository/repositories';

@Module({
  imports: [CacheModule.register()],
  providers: [AuthRepository, UserRepository],
  exports: [AuthRepository, UserRepository],
})
export class RepositoryModule {}
