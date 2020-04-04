import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GeoLocationInput {
  @Field()
  longitude?: string;

  @Field()
  latitude?: string;
}
