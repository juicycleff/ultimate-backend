/* tslint:disable:max-classes-per-file */
import { InputType, Field, ArgsType, ID } from '@nestjs/graphql';
import {
  FilterMongo,
  PaginationInput,
  WebhookHttpVerbEnum,
  WebhookCrudEnum,
} from '@ultimatebackend/contracts';
import {
  Webhook,
  AuthBasic,
  AuthOAuth2,
  AuthToken,
  AuthApiKey,
  AuthNone,
} from './webhook.type';

@InputType()
export class WebhookAuthTypesInput {
  @Field(() => AuthBasic, {
    nullable: true,
  })
  basic?: AuthBasic;

  @Field(() => AuthOAuth2, {
    nullable: true,
  })
  oauth2?: AuthOAuth2;

  @Field(() => AuthToken, {
    nullable: true,
  })
  token?: AuthToken;

  @Field(() => AuthApiKey, {
    nullable: true,
  })
  apiKey?: AuthApiKey;

  @Field(() => AuthNone, {
    nullable: true,
  })
  none?: AuthNone;
}

@InputType()
export class CreateWebhookInput {
  @Field()
  name: string;

  @Field()
  endpoint: string;

  @Field(() => [WebhookCrudEnum], { nullable: true })
  action?: WebhookCrudEnum[];

  @Field(() => WebhookHttpVerbEnum)
  requestType: WebhookHttpVerbEnum;

  @Field(() => WebhookAuthTypesInput)
  auth: WebhookAuthTypesInput;
}

@InputType()
export class DeleteWebhookInput {
  @Field({ nullable: true })
  id?: string;
}

@InputType()
export class UpdateWebhookDataInput {
  @Field()
  name: string;

  @Field()
  endpoint: string;

  @Field(() => [WebhookCrudEnum], { nullable: true })
  action?: WebhookCrudEnum[];

  @Field(() => WebhookHttpVerbEnum)
  requestType: WebhookHttpVerbEnum;

  @Field(() => WebhookAuthTypesInput)
  auth: WebhookAuthTypesInput;
}

@InputType()
export class UpdateWebhookInput {
  @Field(() => ID)
  id: string;

  @Field(() => UpdateWebhookDataInput)
  data: UpdateWebhookDataInput;
}

@InputType()
export class WebhookFilterInput extends FilterMongo(Webhook, {
  simple: true,
}) {}

@ArgsType()
export class WebhookFilterArgs {
  @Field(() => WebhookFilterInput, { nullable: true })
  where?: WebhookFilterInput;

  @Field(() => PaginationInput, { nullable: true })
  paginate?: PaginationInput;
}
