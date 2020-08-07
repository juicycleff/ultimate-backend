import { IPermission } from '../';

export class IResource {
  name: string;
  supportsToken?: boolean;
  roles: InAppRole[];
  readonly identify: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export type InAppRole =
  | 'admin'
  | 'owner'
  | 'member'
  | 'developer'
  | 'guest'
  | 'customer';
