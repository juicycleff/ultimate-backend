import { Request } from 'express';
import { UserEntity } from '@graphqlcqrs/repository';
import { TenantInfo } from '@juicycleff/nest-multi-tenant';

export interface IRequest extends Request {
  user?: UserEntity;
  vhost?: any;
  tenantInfo?: TenantInfo;
}
