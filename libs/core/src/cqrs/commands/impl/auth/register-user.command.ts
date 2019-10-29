import { ICommand } from '@nestjs/cqrs';
import { RegisterInput } from '@graphqlcqrs/core/dto';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly cmd: RegisterInput,
    // tslint:disable-next-line:no-empty
  ) {}
}
