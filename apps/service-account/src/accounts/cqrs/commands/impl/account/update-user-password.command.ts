import { ICommand } from '@nestjs/cqrs';
import * as Account from '@ultimatebackend/proto-schema/account';

export class UpdateUserPasswordCommand implements ICommand {
  constructor(public readonly cmd: Partial<Account.UpdatePasswordRequest>) {}
}
