import { ICommand } from '@nestjs/cqrs';
import { LoginInput } from '@graphqlcqrs/core/dto';

export class VerifyEmailCommand implements ICommand {
  constructor(
    public readonly code: number,
    public readonly email: string,
    // tslint:disable-next-line:no-empty
  ) {}
}
