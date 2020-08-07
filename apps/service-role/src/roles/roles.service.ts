import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NestCasbinService } from 'nestjs-casbin';
import { defaultResourceBuilder } from './helper';

@Injectable()
export class RolesService implements OnModuleInit {
  logger = new Logger(this.constructor.name);
  constructor(private readonly userEnforcer: NestCasbinService) {}

  async populateRoles() {
    const resources = defaultResourceBuilder();
    for (const res of resources) {
      if (res.actions.read.length > 0) {
        for (const a of res.actions.read) {
          try {
            const check = await this.userEnforcer.hasPolicy(
              a,
              res.name,
              'read',
            );
            if (!check) {
              await this.userEnforcer.addPolicy(a, res.name, 'read');
            }
          } catch (e) {
            this.logger.error(e);
          }
        }
      }

      if (res.actions.create.length > 0) {
        for (const a of res.actions.create) {
          try {
            const check = await this.userEnforcer.hasPolicy(
              a,
              res.name,
              'create',
            );
            if (!check) {
              await this.userEnforcer.addPolicy(a, res.name, 'create');
            }
          } catch (e) {
            this.logger.error(e);
          }
        }
      }

      if (res.actions.delete.length > 0) {
        for (const a of res.actions.delete) {
          try {
            const check = await this.userEnforcer.hasPolicy(
              a,
              res.name,
              'delete',
            );
            if (!check) {
              await this.userEnforcer.checkPermission(a, res.name, 'delete');
            }
          } catch (e) {
            this.logger.error(e);
          }
        }
      }

      if (res.actions.update.length > 0) {
        for (const a of res.actions.update) {
          try {
            const check = await this.userEnforcer.hasPolicy(
              a,
              res.name,
              'update',
            );
            if (!check) {
              await this.userEnforcer.addPolicy(a, res.name, 'update');
            }
          } catch (e) {
            this.logger.error(e);
          }
        }
      }
    }
  }

  onModuleInit(): any {
    // this.populateRoles();
  }
}
