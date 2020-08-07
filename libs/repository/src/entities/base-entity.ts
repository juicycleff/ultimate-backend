import { AggregateRoot } from '@nestjs/cqrs';
import { ObjectID } from 'mongodb';
import { BaseDto } from '../dtos';

export abstract class BaseEntity<
  T extends BaseDto = BaseDto
> extends AggregateRoot {
  id?: ObjectID | string;

  createdBy?: ObjectID | string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date = null;

  deleted?: boolean = false;

  version?: number = null;

  toDtoClass?: new (entity: BaseEntity, options?: any) => T;

  // toDto = (options?: any) => DtoMapperUtils.toDto(this.toDtoClass, this, options);
}
