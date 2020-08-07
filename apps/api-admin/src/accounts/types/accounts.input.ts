import { InputType, Field } from '@nestjs/graphql';
import { ServiceTypes } from '@ultimatebackend/contracts';

@InputType()
export class LoginParamsInput {
  @Field({
    description: 'Access token for social (Service: Twitter, Github, Email)',
    nullable: true,
  })
  accessToken?: string;

  @Field({
    description: 'Access token for social (Service: Twitter, Github, Email)',
    nullable: true,
  })
  accessTokenSecret?: string;

  @Field({ description: 'User password (Service: Password)', nullable: true })
  password?: string;

  @Field({
    description: 'Primary email of the user (Service: Password)',
    nullable: true,
  })
  email?: string;
}

@InputType()
export class LoginInput {
  @Field(() => ServiceTypes)
  service: ServiceTypes;

  @Field(() => LoginParamsInput)
  params: LoginParamsInput;
}

@InputType()
export class RegisterInput {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
