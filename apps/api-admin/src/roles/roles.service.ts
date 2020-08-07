import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IResource, RolesRpcClientService } from '@ultimatebackend/core';
import { getMetadataStorage } from '@ultimatebackend/core/metadata';

@Injectable()
export class RolesService implements OnModuleInit {
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
      const metaData = RolesService.scanResourcesAndPermissions();

      setTimeout(async () => {
        await this.savePermissionsAndResources(metaData);
      }, 19000);
    } catch (e) {
      Logger.error(e, this.constructor.name);
    }
  }
}
