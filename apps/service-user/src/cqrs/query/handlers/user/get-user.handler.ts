import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { UserRepository } from '@graphqlcqrs/repository/repositories';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { GetUserQuery } from '../../';
import { mongoParser } from '@juicycleff/nest-multi-tenant';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<UserEntity> {
    Logger.log(query, 'GetUserQuery'); // write here
    const { where } = query;

    if (!where) { throw Error('Missing get inputs'); }
    const filter = mongoParser(where);
    return await this.userRepository.findOne({ ...filter }, true);
  }
}
