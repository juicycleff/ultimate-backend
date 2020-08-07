import { Entity } from '@juicycleff/repo-orm';
import { AuthResponseDto } from '../dtos/response';
import { BaseEntity } from './base-entity';
import {
  BillingSettingEmbed,
  TenantMemberEmbed,
  TenantSettingsEmbed,
} from './embeded';

@Entity({ name: 'tenant' })
export class TenantEntity extends BaseEntity<AuthResponseDto> {
  name: string;

  normalizedName!: string;

  settings?: TenantSettingsEmbed;

  billing?: BillingSettingEmbed;

  members: TenantMemberEmbed[];

  currentPlan!: string;
}
