import { Entity } from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'mongodb';
import { AppRole, InvitationStatus } from '@ultimatebackend/contracts';

@Entity({name: 'tenant-member'})
export class TenantMemberEmbed {

  id!: string;

  email: string;

  userId?: ObjectID | string;

  status!: InvitationStatus;

  role: AppRole;

  invitedBy!: string | ObjectID | any;

  createdAt!: Date | string;

  updatedAt!: Date | string;
}
