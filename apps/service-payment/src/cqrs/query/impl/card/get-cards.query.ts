import {IQuery} from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository';

export class GetCardsQuery implements IQuery {
  constructor(
    public readonly user: UserEntity,
  ) {}
}
