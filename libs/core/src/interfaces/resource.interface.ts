import { IPermission } from '../';

export class IResource {
  name: string;
  readonly identify: string;
  permissions?: IPermission[];
}
