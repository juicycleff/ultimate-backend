import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { AuthRepository } from '@graphqlcqrs/repository';
import { AuthExistQuery } from '../../impl';

@QueryHandler(AuthExistQuery)
export class AuthExistHandler implements IQueryHandler<AuthExistQuery> {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(query: AuthExistQuery): Promise<boolean> {
    Logger.log(query, 'AuthExistQuery');
    const { where } = query;
    if (!where) { throw Error('Missing get inputs'); }
    // @ts-ignore
    return await this.authRepository.exist({ 'local.email': where.local.email});
  }
}
