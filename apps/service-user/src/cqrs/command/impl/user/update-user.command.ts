import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';
import { ObjectID } from 'bson';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string | ObjectID,
    public readonly data: Partial<UserEntity>,
  ) {}
}
