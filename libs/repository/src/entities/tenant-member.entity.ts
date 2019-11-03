import { Entity } from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'mongodb';
import {BaseEntity} from './base-entity';
import { AppRole, InvitationStatus } from '@graphqlcqrs/common';

@Entity({name: 'tenant-member'})
export class TenantMemberEntity extends BaseEntity<any> {

  email: string;

  status!: InvitationStatus;

  role: AppRole;

  tenantId: ObjectID;

}
