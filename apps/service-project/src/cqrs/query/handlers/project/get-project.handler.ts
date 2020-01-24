import { Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import { UserInputError, ApolloError } from 'apollo-server-express';
import { GetProjectQuery } from '../../impl';
import { ProjectEntity, ProjectRepository } from '@graphqlcqrs/repository';
import { mongoParser } from '@juicycleff/nest-multi-tenant';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  async execute(query: GetProjectQuery): Promise<ProjectEntity> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${query.constructor.name}...`);
    const { where, projectRepository } = query;
    this.projectRepository = projectRepository;

    if (!where) { throw new UserInputError('Missing project where input'); }

    try {
      const filter = mongoParser(where);
      return await this.projectRepository.findOne({...filter });
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
