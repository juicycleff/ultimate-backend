import {IQuery} from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';

export class GetCardQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly user: UserEntity,
  ) {}
}
