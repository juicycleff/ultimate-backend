import { Field, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export abstract class WithTenantInput {
  @Field({ nullable: true })
  tenantId: string;
}
