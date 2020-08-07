import {
  NestCasbinModuleOptions,
  NestCasbinOptionsFactory,
} from 'nestjs-casbin';
import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { CASBIN_CUSTOM_ADAPTER } from './constants';

@Injectable()
export class CasbinUserConfigService implements NestCasbinOptionsFactory {
  constructor(@Inject(CASBIN_CUSTOM_ADAPTER) private readonly adapter) {}

  createCasbinOptions(
    connectionName?: string,
  ): Promise<NestCasbinModuleOptions> | NestCasbinModuleOptions {
    return {
      adapter: this.adapter,
      model: join(__dirname, './acl_model.conf'),
    };
  }
}
