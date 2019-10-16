import {Entity, Column, OneToOne, BeforeInsert, BeforeUpdate} from 'typeorm';
import { generateHashedPassword } from '@graphqlcqrs/common/utils';
import {AuthResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';
import {UserEntity} from './user.entity';
import { LocalAuth } from './embeded/social';

@Entity()
export class AuthEntity extends BaseEntity<AuthResponseDto> {

  @Column( type => LocalAuth, {})
  local: LocalAuth;

  @OneToOne(type => UserEntity, user => user.auth)
  user?: UserEntity;

  toDtoClass: new(entity: BaseEntity, options?: any) => AuthResponseDto;

  @BeforeInsert()
  @BeforeUpdate()
  enrichName() {
    this.local.hashedPassword = generateHashedPassword(this.local.hashedPassword);
  }
}
