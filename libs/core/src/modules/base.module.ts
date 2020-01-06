/* tslint:disable:ban-types */
import { Logger, OnModuleInit } from '@nestjs/common';
import { getMetadataStorage } from '@graphqlcqrs/core/metadata';
import { IPermission, IResource } from '@graphqlcqrs/core';
import { Client, ClientGrpcProxy, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IRoleService } from '@graphqlcqrs/core/grpc/interfaces';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

export class BaseModule implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      url: (process.env.AUTH_GRPC_ENDPOINT && process.env.AUTH_GRPC_ENDPOINT.replace('http://', ''))
        || `localhost:${AppConfig.services?.auth?.grpcPort || 7900}`,
      protoPath: join('proto/role.proto'),
    },
  })
  client: ClientGrpcProxy;
  roleService: IRoleService;

  private static scanResourcesAndPermissions() {
    const metadataMap: Map<string, { name: string, resource: IResource[] }> = new Map();
    const resources = getMetadataStorage().resources;
    const permissions = getMetadataStorage().permissions;

    for (const r of resources) {
      const resource: IResource = {
        identify: r.options.identify,
        name: r.options.name,
      };

      const metaKey =  r.prototype?.prototype?.constructor?.name as string;
      const moduleKey =  metaKey.replace('Resolver', '');
      const perms: IPermission[] = [];

      for (const p of permissions) {
        if (r.prototype?.prototype?.constructor?.name === p.objectType) {
          perms.push(p.options);
        }
      }

      resource.permissions = perms;

      if (metadataMap.has(moduleKey)) {
        metadataMap.get(moduleKey).name = metaKey;
        metadataMap.get(moduleKey).resource.push(resource);
      } else {
        metadataMap.set(moduleKey, { name: metaKey, resource: [resource] });
      }
    }

    return metadataMap;
  }

  public async savePermissionsAndResources(metadataMap: Map<string, { name: string, resource: IResource[] }>) {
    const obj = {};
    metadataMap.forEach((v, k) => obj[k] = v);

    try {
      for (const [kv, v] of metadataMap) {
        for (const r of v.resource) {
          for (const p of r.permissions) {
            if (p.action === 'create') {
              await this.roleService.addPolicy({ params: ['owner', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
              await this.roleService.addPolicy({ params: ['admin', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
            }

            if (p.action === 'update') {
              await this.roleService.addPolicy({ params: ['owner', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
              await this.roleService.addPolicy({ params: ['admin', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
            }

            if (p.action === 'delete') {
              await this.roleService.addPolicy({ params: ['owner', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
              await this.roleService.addPolicy({ params: ['admin', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
              await this.roleService.addPolicy({ params: ['member', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
            }

            if (p.action === 'read') {
              await this.roleService.addPolicy({ params: ['owner', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
              await this.roleService.addPolicy({ params: ['admin', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
              await this.roleService.addPolicy({ params: ['member', p.tenant || '*', `${r.identify}-${p.identify}`, p.action] }).toPromise();
            }
          }
        }
      }
    } catch (e) {
      Logger.error(e, this.constructor.name);
    }
  }

  async onModuleInit() {
    this.roleService = this.client.getService<IRoleService>('RoleService');
    try {
      const metaData = BaseModule.scanResourcesAndPermissions();
      await this.savePermissionsAndResources(metaData);

    } catch (e) {
      Logger.error(e, this.constructor.name);
    }
  }
}
