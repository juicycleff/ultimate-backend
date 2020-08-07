import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { mongoParser } from '@juicycleff/repo-orm';
import { UserRepository, UserEntity } from '@ultimatebackend/repository';
import { GetUserQuery } from '../../impl';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  logger = new Logger(this.constructor.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<UserEntity> {
    this.logger.log(query);
    const { where } = query;

    if (!where) {
      throw Error('Missing get inputs');
    }
    const filter = mongoParser(where);

    return await this.userRepository.findOne({ ...filter }, true);
  }
}
