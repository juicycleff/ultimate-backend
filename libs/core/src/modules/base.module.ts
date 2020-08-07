/* tslint:disable:ban-types */
import { Logger, OnModuleInit } from '@nestjs/common';
import { IPermission, IResource } from '../interfaces';
import { join } from 'path';
import { getMetadataStorage } from '@ultimatebackend/core/metadata';
import { RolesRpcClientService } from '@ultimatebackend/core/services';

export class BaseModule implements OnModuleInit {
  constructor(private readonly clientService: RolesRpcClientService) {}

  private static scanResourcesAndPermissions() {
    const metadataMap: Map<
      string,
      { name: string; resource: IResource[] }
    > = new Map();
    const resources = getMetadataStorage().resources;
    // const permissions = getMetadataStorage().permissions;

    for (const r of resources) {
      const resource: IResource = {
        roles: r.options.roles,
        identify: r.options.identify,
        name: r.options.name,
        action: r.options.action,
      };

      const metaKey = r.prototype?.constructor?.name as string;
      const moduleKey = metaKey.replace('Resolver', '');

      if (metadataMap.has(moduleKey)) {
        metadataMap.get(moduleKey).name = metaKey;
        metadataMap.get(moduleKey).resource.push(resource);
      } else {
        metadataMap.set(moduleKey, { name: metaKey, resource: [resource] });
      }
    }

    return metadataMap;
  }

  public async savePermissionsAndResources(
    metadataMap: Map<string, { name: string; resource: IResource[] }>,
  ) {
    const obj = {};
    metadataMap.forEach((v, k) => (obj[k] = v));

    try {
      for (const [kv, v] of metadataMap) {
        for (const r of v.resource) {
          for (const role of r.roles) {
            await this.clientService.svc
              .addPolicy({ params: [role, r.identify, r.action] })
              .toPromise();
          }
        }
      }
    } catch (e) {
      Logger.error(e, this.constructor.name);
    }
  }

  async onModuleInit() {
    try {
      const metaData = BaseModule.scanResourcesAndPermissions();
      await this.savePermissionsAndResources(metaData);
    } catch (e) {
      Logger.error(e, this.constructor.name);
    }
  }
}
