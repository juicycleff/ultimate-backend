import { Module } from '@nestjs/common';
import { RolesResolver } from './roles.resolver';
import { RolesController } from './roles.controller';

@Module({
  providers: [RolesResolver],
  controllers: [RolesController],
})
export class RolesModule {}
