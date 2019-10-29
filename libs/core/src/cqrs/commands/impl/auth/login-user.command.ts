import { ICommand } from '@nestjs/cqrs';
import { LoginInput } from '@graphqlcqrs/core/dto';

export class LoginUserCommand implements ICommand {
  constructor(
    public readonly cmd: LoginInput,
    // tslint:disable-next-line:no-empty
  ) {}
}
