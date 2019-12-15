import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';

export class CreateUserCommand implements ICommand {
  constructor(public readonly user: UserEntity) {}
}
