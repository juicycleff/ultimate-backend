import { Module } from '@nestjs/common';
import { AuthRepository } from '@graphqlcqrs/repository/repositories/auth.repository';

@Module({
  providers: [AuthRepository],
  exports: [AuthRepository],
})
export class RepositoryModule {}
