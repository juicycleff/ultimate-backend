import {IQuery} from '@nestjs/cqrs';
import { LocalAuth } from '@graphqlcqrs/repository/entities';

export class AuthExistQuery implements IQuery {
  constructor(
    public readonly localAuth: LocalAuth) {}
}
