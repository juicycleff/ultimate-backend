/* tslint:disable:max-classes-per-file */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeSubscriptionInput {
  @Field()
  planId: string;

  @Field({ nullable: true })
  couponId?: string;
}
