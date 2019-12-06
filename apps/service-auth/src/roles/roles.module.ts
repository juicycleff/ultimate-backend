import { Module, OnModuleInit } from '@nestjs/common';
import { NestCasbinService } from 'nestjs-casbin-mongodb';
import { RolesResolver } from './roles.resolver';
import { seedAppRoles } from '../seed/roles';

@Module({
  providers: [RolesResolver],
})
export class RolesModule implements OnModuleInit {
  constructor(private readonly casbinService: NestCasbinService) {}

  onModuleInit(): any {

    // Seed app roles
    seedAppRoles.map( rt => {
      rt.permissions.map(async perm => {
        await this.casbinService.addPolicy(rt.normalizedName, '*', '*', perm);
      });
    });
  }
}
