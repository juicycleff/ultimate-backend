import { Injectable, Logger } from '@nestjs/common';
import { UserInputError, ApolloError } from 'apollo-server-express';
import { CreateProjectInput, DeleteProjectInput, ProjectFilterArgs, ProjectFilterInput, UpdateProjectInput } from '../types';
import { ProjectEntity, ProjectRepository } from '@graphqlcqrs/repository';
import { NotFoundError } from '@graphqlcqrs/common/errors';
import { cleanEmptyProperties } from '@graphqlcqrs/common/utils';
import { ProjectDeletedEvent, ProjectUpdatedEvent } from '@graphqlcqrs/core/cqrs';
import { EventBus } from '@nestjs/cqrs';
import { mongoParser } from '@juicycleff/nest-multi-tenant';

@Injectable()
export class ProjectService {
  logger = new Logger(this.constructor.name);

  public constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly eventBus: EventBus,
  ) {}

  async create(input: CreateProjectInput): Promise<ProjectEntity> {

    try {
      if (input === null || input.name === null ) { // Check to make sure input is not null
        throw new UserInputError('Project input name missing'); // Throw an apollo input error
      }

      return await this.projectRepository.create({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error);
    }
  }

  async update(input: UpdateProjectInput): Promise<ProjectEntity> {

    try {
      if (input === null) { // Check to make sure input is not null
        throw new UserInputError('Project input name missing'); // Throw an apollo input error
      }

      if (input.id === null) { // Check to make sure input is not null
        throw new UserInputError('Project to update id input missing'); // Throw an apollo input error
      }

      const productExist = await this.projectRepository.exist({ _id: input.id });
      if (!productExist) {
        throw new NotFoundError('Project with id does not exist');
      }

      const update = cleanEmptyProperties(input.data);
      const project = await this.projectRepository.findOneByIdAndUpdate(input.id, {
        updates: {
          $set: { ...update },
        },
      });

      await this.eventBus.publish(new ProjectUpdatedEvent(project));
      return project;
    } catch (error) {
        this.logger.error(error);
        throw new ApolloError(error);
    }
  }

  async delete(input: DeleteProjectInput): Promise<ProjectEntity> {

    try {
      if (!input || input.id === null) { // Check to make sure input is not null
        throw new UserInputError('Project id is missing'); // Throw an apollo input error
      }
      const product = await this.projectRepository.findById(input.id);
      if (!product) {
        throw new NotFoundError('Project with id does not exist');
      }

      await this.projectRepository.deleteOne({ _id: input.id});
      await this.eventBus.publish(new ProjectDeletedEvent(product));

      return product;
    } catch (error) {
        this.logger.error(error);
        throw new ApolloError(error);
    }
  }

  async findOne(input: ProjectFilterInput): Promise<ProjectEntity> {
    const { where } = input;
    if (!where) { throw new UserInputError('Missing project where input'); }

    try {
      const filter = mongoParser(where);
      return await this.projectRepository.findOne({...filter });
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }

  async find(input: ProjectFilterArgs): Promise<ProjectEntity[]> {
    try {
      if (!input.where) {
        const filter = mongoParser(input.where);
        return await this.projectRepository.find({
          conditions: { ...filter },
          limit: input.paginate?.limit || 10,
          skip: input.paginate?.skip || 0,
        });
      }
      return await this.projectRepository.find();
    } catch (e) {
      this.logger.error(e);
      throw new ApolloError(e);
    }
  }
}
