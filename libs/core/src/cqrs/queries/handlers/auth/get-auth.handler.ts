import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { AuthRepository, AuthEntity } from '@graphqlcqrs/repository';
import { GetAuthQuery } from '../../';

@QueryHandler(GetAuthQuery)
export class GetAuthHandler implements IQueryHandler<GetAuthQuery> {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(query: GetAuthQuery): Promise<AuthEntity> {
    Logger.log(query, 'GetAuthQuery');
    const { where } = query;
    if (!where) { throw Error('Missing get inputs'); }
    return await this.authRepository.findOne({
      where,
    });
  }
}
