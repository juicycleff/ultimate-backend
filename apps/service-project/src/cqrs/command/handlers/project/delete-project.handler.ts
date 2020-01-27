import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { ProjectEntity, ProjectRepository } from '@graphqlcqrs/repository';
import { ProjectDeletedEvent } from '@graphqlcqrs/core';
import { NotFoundError } from '@graphqlcqrs/common';
import { DeleteProjectCommand } from '../../impl';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  public constructor(
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<ProjectEntity> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${command.constructor.name}...`);
    const { input, projectRepository } = command;
    this.projectRepository = projectRepository;

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

}
