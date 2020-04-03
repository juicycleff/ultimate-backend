import { Field, InputType } from 'type-graphql';

@InputType()
export class GeoLocationInput {
  @Field()
  longitude?: string;

  @Field()
  latitude?: string;
}
