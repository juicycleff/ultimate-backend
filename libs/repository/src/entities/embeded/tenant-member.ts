import { Entity } from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'mongodb';
import { AppRole, InvitationStatus } from '@graphqlcqrs/common';

@Entity({name: 'tenant-member'})
export class TenantMemberEmbed {

  id!: string;

  email: string;

  userId?: ObjectID | string;

  status!: InvitationStatus;

  role: AppRole;

  createdAt!: Date | string;

  updatedAt!: Date | string;
}
