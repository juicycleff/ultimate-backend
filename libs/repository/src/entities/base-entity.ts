import {AggregateRoot} from '@nestjs/cqrs';
// import {IsNotEmpty, IsDateString} from 'class-validator';
import { ObjectID } from 'mongodb';
import { DtoMapperUtils } from '@graphqlcqrs/common';
import {BaseDto} from '../dtos';
import { Before, ObjectIdColumn } from '@juicycleff/nest-multi-tenant';

export abstract class BaseEntity<T extends BaseDto = BaseDto> extends AggregateRoot {

  // @IsNotEmpty()
  @ObjectIdColumn()
  id: ObjectID | string;

  // @IsDateString()
  // @Column({ nullable: false })
  createdAt!: Date | string;

  // @IsDateString()
  // @Column({ nullable: true })
  updatedAt!: Date | string;

  // @IsDateString()
  // @Column()
  deletedAt?: Date | string;

  // @IsDateString()
  // @Column({ default: false })
  deleted?: boolean;

  // @VersionColumn()
  version!: number;

  toDtoClass?: new (entity: BaseEntity, options?: any) => T;

  toDto = (options?: any) => DtoMapperUtils.toDto(this.toDtoClass, this, options);
}
