import { Entity } from '@juicycleff/repo-orm';
import { BaseEntity } from './base-entity';

@Entity({ name: 'access-token' })
export class AccessTokenEntity extends BaseEntity<any> {
  name: string;

  token: string;

  tenantId?: string;

  expireAt?: Date | string;

  scopes?: string[];

  active: boolean;
}
