import {AuthResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import { LocalAuth } from './embeded/social';
import { Entity } from '@juicycleff/nest-multi-tenant';

@Entity({name: 'auth'})
export class AuthEntity extends BaseEntity<AuthResponseDto> {

  local: LocalAuth;

  // @Column(type => UserEntity)
  // user?: UserEntity;
}
