import {Logger} from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { UserRepository } from '@graphqlcqrs/repository/repositories';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { GetUserQuery } from '../../impl';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<UserEntity> {
    Logger.log(query, 'GetUserQuery'); // write here
    const { where } = query;

    if (!where) { throw Error('Missing get inputs'); }
    return await this.userRepository.findOne({ ...where });
  }
}
