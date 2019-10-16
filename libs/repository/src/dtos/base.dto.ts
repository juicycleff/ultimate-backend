import {BaseEntity} from '../entities';

export class BaseDto {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  constructor(entity: BaseEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
