import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { ProjectEntity, ProjectRepository } from '@graphqlcqrs/repository';
import { ProjectUpdatedEvent } from '@graphqlcqrs/core';
import { cleanEmptyProperties, NotFoundError } from '@graphqlcqrs/common';
import { UpdateProjectCommand } from '../../impl';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  public constructor(
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<ProjectEntity> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${command.constructor.name}...`);
    const { input, projectRepository } = command;
    this.projectRepository = projectRepository;

    try {
      if (input === null ) { // Check to make sure input is not null
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
      this.logger.log(error);
      throw new ApolloError(error);
    }
  }

}
