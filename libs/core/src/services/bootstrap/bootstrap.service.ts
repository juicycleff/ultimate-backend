import { Global, Injectable } from '@nestjs/common';
import { NestCasbinService } from 'nestjs-casbin-mongodb';
import { IResource } from '@graphqlcqrs/core';

@Injectable()
export class BootstrapService {
  constructor(private readonly casbinService: NestCasbinService) {}

  public async savePermissionsAndResources(metadataMap: Map<string, { name: string, resource: IResource[] }>) {
    console.log('Koop');
    console.log('obj');
    const obj = {};
    metadataMap.forEach((v, k) => obj[k] = v);
    console.log(JSON.stringify(obj));
  }

  public async hello() {
    console.log('Koop');
  }
}
