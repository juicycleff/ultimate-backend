import { ICommand } from '@nestjs/cqrs';
import * as Account from '@ultimatebackend/proto-schema/account';

export class LoginUserCommand implements ICommand {
  constructor(public readonly cmd: Account.LoginRequest) {}
}
