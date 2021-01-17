import { Inject, Injectable } from '@nestjs/common';
import { PERMISSION_MODULE_OPTIONS } from './permissions.constants';
import { PermissionsModuleOptions } from './interfaces';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSION_MODULE_OPTIONS) private readonly options: PermissionsModuleOptions) {
  }


}
