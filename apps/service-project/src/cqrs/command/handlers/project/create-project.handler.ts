import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { ProjectEntity, ProjectRepository } from '@graphqlcqrs/repository';
import { ProjectCreatedEvent } from '@graphqlcqrs/core';
import { CreateProjectCommand } from '../../impl';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  public constructor(
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProjectCommand): Promise<ProjectEntity> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${command.constructor.name}...`);
    const { input, projectRepository } = command;
    this.projectRepository = projectRepository;

    try {
      if (input === null || input.name === null ) { // Check to make sure input is not null
        throw new UserInputError('Project input name missing'); // Throw an apollo input error
      }

      const project = await this.projectRepository.create({
        ...input,
      });

      await this.eventBus.publish(new ProjectCreatedEvent(project));
      return project;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error);
    }
  }
}
