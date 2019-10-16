import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Module({
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
