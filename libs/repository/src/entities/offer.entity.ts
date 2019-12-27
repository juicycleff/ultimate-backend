import { Entity } from '@juicycleff/nest-multi-tenant';
import { ObjectID } from 'bson';
import { MongoBaseEntity } from './base-entity';

@Entity({name: 'offer'})
export class OfferEntity extends MongoBaseEntity<any> {

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
