import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { CASBIN_ENFORCER } from './nest-casbin.constants';

@Injectable()
export class NestCasbinService {
  constructor(@Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer) {}

  public async reloadPolicy() {
    await this.enforcer.loadPolicy();
  }

  public async addPolicy(...params: string[]) {
    const added = await this.enforcer.addPolicy(...params);
    if (added) {
      await this.enforcer.savePolicy();
    }
  }

  public async removePolicy(...params: string[]) {
    const removed = await this.enforcer.removePolicy(...params);
    if (removed) {
      await this.enforcer.savePolicy();
    }
  }

  // TODO: edit this in adapter to make it query from database
  // the operation will look like `await this.enforcer.getAdapter().enforce()`
  public async checkPermission(...params: any[]) {
    return this.enforcer.enforce(params);
  }
}
