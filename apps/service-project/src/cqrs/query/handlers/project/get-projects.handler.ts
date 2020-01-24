import { Logger } from '@nestjs/common';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ApolloError} from 'apollo-server-express';
import { mongoParser } from '@juicycleff/nest-multi-tenant';
import { ProjectEntity, ProjectRepository } from '@graphqlcqrs/repository';
import { GetProjectsQuery } from '../../impl';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  async execute(query: GetProjectsQuery): Promise<ProjectEntity[]> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${query.constructor.name}...`);
    const { input, projectRepository } = query;
    this.projectRepository = projectRepository;

    try {

      if (input.where) {
        const filter = mongoParser(input.where);
        return await this.projectRepository.find({
          conditions: { ...filter },
          limit: input.paginate?.limit || 10,
          skip: input.paginate?.skip || 0,
        });
      }
      return await this.projectRepository.find();
    } catch (e) {
      throw new ApolloError(e);
    }
  }
}
