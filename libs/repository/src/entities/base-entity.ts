import {AggregateRoot} from '@nestjs/cqrs';
import {IsNotEmpty, IsDateString} from 'class-validator';
import { DtoMapperUtils } from '@graphqlcqrs/common';
import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm';
import {BaseDto} from '../dtos';

export abstract class BaseEntity<T extends BaseDto = BaseDto> extends AggregateRoot {

  @IsNotEmpty()
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  /* @IsUUID()
  @Index({ unique: true })
  @Column({ generated: 'uuid', nullable: false, unique: true })
  appSpecificId?: string; */

  @IsDateString()
  @CreateDateColumn({ name: 'created_at', nullable: false, type: 'timestamp without time zone' })
  createdAt?: Date | string;

  @IsDateString()
  @UpdateDateColumn({ name: 'updated_at', nullable: false, type: 'timestamp without time zone' })
  updatedAt?: Date | string;

  @IsDateString()
  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp' })
  deletedAt?: Date | string;

  @VersionColumn()
  version?: number;

  abstract toDtoClass?: new (entity: BaseEntity, options?: any) => T;

  toDto(options?: any) {
    return DtoMapperUtils.toDto(this.toDtoClass, this, options);
  }

  /**
   * Soft delete
   */
  public remove(): void {
    this.deletedAt = new Date();
  }
}
