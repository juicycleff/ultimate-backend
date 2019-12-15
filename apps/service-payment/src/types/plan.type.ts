import { Directive, Field, ObjectType } from 'type-graphql/dist';
import { Feature, FeatureFilterInput, Node, Price, PriceFilterInput } from '@ultimatebackend/contracts';
import { Filterable } from '@graphqlcqrs/core';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Plan extends Node {

  @Filterable()
  @Field()
  name: string;

  @Filterable()
  @Field()
  normalizedName!: string;

  @Filterable({ type: PriceFilterInput })
  @Field(() => [Price], { nullable: true })
  prices: Price[];

  @Filterable({ type: FeatureFilterInput })
  @Field(() => [Feature], { nullable: true })
  features: Feature[];

  @Filterable()
  @Field({ nullable: true })
  free: boolean;

  @Filterable()
  @Field()
  active: boolean;
}
