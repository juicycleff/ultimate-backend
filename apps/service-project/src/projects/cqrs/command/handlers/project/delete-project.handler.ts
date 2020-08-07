import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@ultimatebackend/repository';
import { ProjectDeletedEvent } from '@ultimatebackend/core';
import { DeleteProjectCommand } from '../../impl';
import {
  DeleteProjectResponse,
  Project,
} from '@ultimatebackend/proto-schema/project';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler
  implements ICommandHandler<DeleteProjectCommand> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  public constructor(private readonly eventBus: EventBus) {}

  async execute(command: DeleteProjectCommand): Promise<DeleteProjectResponse> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${command.constructor.name}...`);
    const { input, projectRepository } = command;
    this.projectRepository = projectRepository;

    try {
      if (!input || input.id === null) {
        // Check to make sure input is not null
        throw new RpcException('Project id is missing');
      }
      const project = await this.projectRepository.findOne(
        { normalizedName: input.id },
        true,
      );
      if (!project) {
        throw new RpcException('Project with id does not exist');
      }

      await this.projectRepository.deleteOne({ RpcException: input.id });
      await this.eventBus.publish(new ProjectDeletedEvent(project));

      return {
        project: (project as unknown) as Project,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
