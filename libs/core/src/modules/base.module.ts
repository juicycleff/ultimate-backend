/* tslint:disable:ban-types */
import { Logger, OnModuleInit } from '@nestjs/common';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';
import { IResource } from '@graphqlcqrs/core';
import { NestCasbinService } from 'nestjs-casbin-mongodb';

export class BaseModule implements OnModuleInit {
  constructor(private readonly casbinService: NestCasbinService) {}

  private scanResourcesAndPermissions() {
    const metadataMap: Map<string, { name: string, resource: IResource[] }> = new Map();
    const resources = getMetadataStorage().resources;
    const permissions = getMetadataStorage().permissions;

    resources.map(r => {
      const resource: IResource = {
        identify: r.options.identify,
        name: r.options.name,
      };

      const metaKey =  r.prototype?.prototype?.constructor?.name as string;
      const moduleKey =  metaKey.replace('Resolver', '');

      permissions.map(p => {
        if (r.prototype?.prototype?.constructor?.name === p.objectType) {
          resource.permissions = [p.options];

          if (metadataMap.has(moduleKey)) {
            metadataMap.get(moduleKey).name = metaKey;
            metadataMap.get(moduleKey).resource.push(resource);
          } else {
            metadataMap.set(moduleKey, { name: metaKey, resource: [resource] });
          }
        }
      });
    });

    return metadataMap;
  }

  public async savePermissionsAndResources(metadataMap: Map<string, { name: string, resource: IResource[] }>) {
    const obj = {};
    metadataMap.forEach((v, k) => obj[k] = v);
    console.log(metadataMap.get('TenantMember').resource);
  }

  async onModuleInit() {
    try {
      const metaData = this.scanResourcesAndPermissions();
      await this.savePermissionsAndResources(metaData);
    } catch (e) {
      Logger.error(e, this.constructor.name);
    }
  }
}
