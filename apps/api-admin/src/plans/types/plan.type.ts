import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Feature, Node, Price } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Plan extends Node {

  @Field()
  name: string;

  @Field()
  normalizedName!: string;

  @Field(() => [Price], { nullable: true })
  prices: Price[];

  @Field(() => [Feature], { nullable: true })
  features: Feature[];

  @Field({ nullable: true })
  free: boolean;

  @Field()
  active: boolean;
}
