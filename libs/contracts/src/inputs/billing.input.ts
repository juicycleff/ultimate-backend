import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInput {
  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  line?: string;

  @Field({ nullable: true })
  line2?: string;
}
