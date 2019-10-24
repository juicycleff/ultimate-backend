import { Entity } from '@juicycleff/nest-multi-tenant';
import {BaseEntity} from './base-entity';
import { PriceEmbed } from '@graphqlcqrs/repository/entities/embeded';

@Entity({name: 'plan'})
export class PlanEntity extends BaseEntity<any> {

  name: string;

  normalizedName?: string;

  pricing: PriceEmbed;

}
