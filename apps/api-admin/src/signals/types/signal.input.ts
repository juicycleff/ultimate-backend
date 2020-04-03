import { InputType, Field, ArgsType } from '@nestjs/graphql';

@InputType()
export class SignalSubscriptionFilterInput {
  @Field({ nullable: true})
  pointMac?: string;
}

@ArgsType()
export class SignalSubscriptionFilterArgs {
  @Field({ nullable: true})
  where?: SignalSubscriptionFilterInput;
}
