import {
  ObjectType,
  Directive,
  GraphQLISODateTime,
  Field,
  InputType,
  Int,
} from '@nestjs/graphql';
import { Node } from '@ultimatebackend/contracts';
import { Filterable } from '@ultimatebackend/core';
import { Member } from '../../tenant-members/types';

@InputType('MqttConfigInput')
@ObjectType()
export class MqttConfig {
  @Field({
    nullable: true,
    defaultValue: 'mqtt://mrbkvuibohg3p.messaging.solace.cloud',
  })
  uri: string;

  @Field({ nullable: true, defaultValue: '1883' })
  port: string;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  password: string;
}

@ObjectType()
export class TenantBilling {
  @Field({ nullable: true })
  currentPlan: string;
}

@InputType('TenantSettingsInput')
@ObjectType()
export class TenantSettings {
  @Field({ nullable: true })
  showStatusIcon: boolean;

  @Field(() => MqttConfig, { nullable: true })
  mqtt: MqttConfig;
}

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Tenant extends Node {
  @Filterable()
  @Field({ nullable: true })
  name: string;

  @Filterable()
  @Field({ nullable: true })
  normalizedName: string;

  @Field({ nullable: true })
  createdBy: string;

  @Field(() => Int, { nullable: true })
  totalPoints: number;

  @Field(() => TenantSettings, { nullable: true })
  settings?: TenantSettings;

  @Field(() => TenantBilling, { nullable: true })
  billing?: TenantBilling;

  @Filterable(() => Member)
  @Field(() => [Member!], { nullable: true })
  members?: Member[];
}

@ObjectType()
export class TenantAccessToken {
  @Field()
  key: string;

  @Field()
  secret: string;

  @Field({ defaultValue: true })
  active: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt: Date | string;
}

@ObjectType()
export class TenantMutations {}
