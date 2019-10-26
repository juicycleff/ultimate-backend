import { Entity } from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'mongodb';
import {AuthResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { FacebookAuth, GoogleAuth, LocalAuth } from './embeded/social';

@Entity({name: 'authentication'})
export class AuthEntity extends BaseEntity<AuthResponseDto> {

  local: LocalAuth;

  facebook?: FacebookAuth;

  google?: GoogleAuth;

  userId?: ObjectID;

  emailVerification: string | number;
}
