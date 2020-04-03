import { CacheModule, Module } from '@nestjs/common';
import { UserRepository } from './';

@Module({
  imports: [CacheModule.register()],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
