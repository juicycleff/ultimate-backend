import { Entity } from '@juicycleff/repo-orm';
import { ObjectID } from 'bson';
import { BaseEntity } from './base-entity';

@Entity({ name: 'offer' })
export class OfferEntity extends BaseEntity<any> {
  name: string;

  description: string;

  code: string;

  startDate?: Date | string;

  endDate?: Date | string;

  discountPercentage?: number;

  discountMonths?: number;

  discountAmount?: number;

  discountEndDate?: Date | string;

  plans?: ObjectID[];
}
