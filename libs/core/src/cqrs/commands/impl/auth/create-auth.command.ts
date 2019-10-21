import { ICommand } from '@nestjs/cqrs';
import { AuthEntity } from '@graphqlcqrs/repository';

export class CreateAuthCommand implements ICommand {
  constructor(
    public readonly auth: AuthEntity,
    // tslint:disable-next-line:no-empty
  ) {}
}
