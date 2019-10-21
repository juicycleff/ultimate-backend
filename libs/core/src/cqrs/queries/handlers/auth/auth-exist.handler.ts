import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { AuthRepository } from '@graphqlcqrs/repository';
import { AuthExistQuery } from '../../';

@QueryHandler(AuthExistQuery)
export class AuthExistHandler implements IQueryHandler<AuthExistQuery> {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(query: AuthExistQuery): Promise<boolean> {
    Logger.log(query, 'AuthExistQuery');
    const { localAuth } = query;
    if (!localAuth) { throw Error('Missing get inputs'); }
    return null; // this.authRepository.exist(localAuth);
  }
}
