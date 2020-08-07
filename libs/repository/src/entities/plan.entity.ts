import { Entity } from '@juicycleff/repo-orm';
import { BaseEntity } from './base-entity';
import { PriceEmbed, FeatureEmbed } from './embeded';

@Entity({ name: 'plan' })
export class PlanEntity extends BaseEntity<any> {
  name: string;

  normalizedName!: string;

  currentPrice?: PriceEmbed;

  prices?: PriceEmbed[];

  features?: FeatureEmbed[];

  active: boolean = false;

  free: boolean = false;

  stripeId?: string = null;
}
