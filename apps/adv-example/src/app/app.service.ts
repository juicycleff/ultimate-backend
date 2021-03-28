import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@ultimate-backend/config';
import { OsoService } from '@ultimate-backend/permissions';
import { PermissionClass } from './permissions/permission.class';

const resourceDb = {
  1: new PermissionClass(true, 'rex', 'can read data'),
  2: new PermissionClass(false, 'ruben', 'cannot read data'),
  3: new PermissionClass(false, 'john', 'cannot read data'),
};

@Injectable()
export class AppService {
  @ConfigValue('name', 'Bar Foo')
  myconfig: string;

  constructor(private readonly oso: OsoService) {}

  async getData(
    userId: string,
    action: string,
    id: number
  ): Promise<{ message: string; access: boolean }> {
    const access = await this.oso.isAllowed(userId, action, resourceDb[id]);
    return { message: 'Welcome to adv-example! ' + this.myconfig, access };
  }
}
