import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Feature, Node, Price } from '@ultimatebackend/contracts';

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Plan extends Node {
  @Field({ description: 'The name of the plan' })
  name: string;

  @Field({
    description:
      'NormalizedName is a special field and a unique identifier of an entity. You can also call it a foreign key',
  })
  normalizedName!: string;

  @Field(() => [Price], { nullable: true })
  prices: Price[];

  @Field(() => [Feature], { nullable: true })
  features: Feature[];

  @Field({
    nullable: true,
    description: 'Flag to tell if the plan you added is free',
  })
  free: boolean;

  @Field({ description: 'Flag to tell if the plan is still active and valid' })
  active: boolean;
}
