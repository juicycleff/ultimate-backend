import { Entity } from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'mongodb';
import {AuthResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { LocalAuth } from './embeded/social';

@Entity({name: 'auth'})
export class AuthEntity extends BaseEntity<AuthResponseDto> {

  local: LocalAuth;

  user!: ObjectID;
}
