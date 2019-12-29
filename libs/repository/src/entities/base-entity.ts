/* tslint:disable:max-classes-per-file */
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

export abstract class MongoBaseEntity<T extends BaseDto = BaseDto> extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID | string;
}

export abstract class ArangoBaseEntity<T extends BaseDto = BaseDto> extends BaseEntity {
  id!: string;
}

export abstract class ArangoBaseEdgeEntity<T extends BaseDto = BaseDto> extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID | string;
}
