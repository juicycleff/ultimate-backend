import { Entity } from '@juicycleff/nest-multi-tenant/database/mongo/decorators/entity.decorator';
import { ObjectID } from 'mongodb';
import {UserResponseDto} from '../dtos/response';
import {BaseEntity} from './base-entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity<UserResponseDto> {

  firstname: string;

  lastname: string;

  email: string;

  authId?: ObjectID;

  toDtoClass?: new(entity: BaseEntity, options?: any) => UserResponseDto;
}
