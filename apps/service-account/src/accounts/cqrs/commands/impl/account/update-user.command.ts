import { ICommand } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import * as Account from '@ultimatebackend/proto-schema/account';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string | ObjectId,
    public readonly data: Partial<Account.UpdateRequest>,
  ) {}
}
