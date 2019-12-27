import { Entity } from '@juicycleff/nest-multi-tenant';
import {MongoBaseEntity} from './base-entity';
import { PriceEmbed, FeatureEmbed } from './embeded';

@Entity({name: 'plan'})
export class PlanEntity extends MongoBaseEntity<any> {

  name: string;

  normalizedName!: string;

  currentPrice?: PriceEmbed;

  prices?: PriceEmbed[];

  features?: FeatureEmbed[];

  active: boolean = false;

  free: boolean = false;

}
