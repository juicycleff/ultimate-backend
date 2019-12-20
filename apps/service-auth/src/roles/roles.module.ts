import { Module } from '@nestjs/common';
import { RolesResolver } from './roles.resolver';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesResolver],
  controllers: [RolesController, RolesService],
})
export class RolesModule {}
