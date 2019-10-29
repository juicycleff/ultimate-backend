import { CacheModule, Module } from '@nestjs/common';
import { UserRepository } from '@graphqlcqrs/repository/repositories';

@Module({
  imports: [CacheModule.register()],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
