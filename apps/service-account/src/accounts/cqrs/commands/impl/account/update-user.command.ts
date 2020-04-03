import { ICommand } from '@nestjs/cqrs';
import { ObjectID } from 'bson';
import * as Account from '@ultimatebackend/proto-schema/account';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string | ObjectID,
    public readonly data: Partial<Account.UpdateRequest>,
  ) {}
}
