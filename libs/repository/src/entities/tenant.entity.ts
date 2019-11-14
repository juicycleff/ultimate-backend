import {Entity} from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'mongodb';
import {AuthResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { TenantAccessEmbed, TenantMemberEmbed } from './embeded';

@Entity({name: 'tenant'})
export class TenantEntity extends BaseEntity<AuthResponseDto> {

  name: string;

  normalizedName!: string;

  tokens!: TenantAccessEmbed[];

  ownerId!: ObjectID;

  members: TenantMemberEmbed[];
}
