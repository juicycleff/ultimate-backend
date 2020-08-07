import { BaseEntity } from '../entities';
import { ObjectID } from 'mongodb';

export class BaseDto {
  id: string | ObjectID;
  createdAt: Date | string;
  updatedAt: Date | string;

  constructor(entity: BaseEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
