import {AggregateRoot} from '@nestjs/cqrs';
import {ObjectID} from 'mongodb';
// import {DtoMapperUtils} from '@graphqlcqrs/common';
import {ObjectIdColumn} from '@juicycleff/nest-multi-tenant';
import {BaseDto} from '../dtos';

export abstract class BaseEntity<T extends BaseDto = BaseDto> extends AggregateRoot {

  @ObjectIdColumn()
  id!: ObjectID | string;

  createdAt!: Date | string;

  updatedAt!: Date | string;

  deletedAt?: Date | string;

  deleted?: boolean;

  version?: number;

  toDtoClass?: new (entity: BaseEntity, options?: any) => T;

  // toDto = (options?: any) => DtoMapperUtils.toDto(this.toDtoClass, this, options);
}
