import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignalData {
  @Field({ nullable: true })
  numericValue?: number;

  @Field()
  rawValue: string;
}
