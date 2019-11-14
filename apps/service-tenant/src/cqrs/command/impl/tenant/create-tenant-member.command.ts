import { ICommand } from '@nestjs/cqrs';
import { TenantMemberEmbed } from '@graphqlcqrs/repository';
import { ObjectID } from 'bson';

export class CreateTenantMemberCommand implements ICommand {
  constructor(
    public readonly input: TenantMemberEmbed,
    public readonly tenantId: ObjectID,
  ) {}
}
