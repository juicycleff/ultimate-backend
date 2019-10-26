import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { AuthRepository, AuthEntity } from '@graphqlcqrs/repository';
import { GetAuthQuery } from '../../impl';

@QueryHandler(GetAuthQuery)
export class GetAuthHandler implements IQueryHandler<GetAuthQuery> {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(query: GetAuthQuery): Promise<AuthEntity> {
    Logger.log(query, 'GetAuthQuery');
    const { where } = query;
    if (!where) { throw Error('Missing get inputs'); }
    // @ts-ignore
    return await this.authRepository.findOne({ 'local.email': where.local.email});
  }
}
