import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@ultimatebackend/repository';
import { ProjectUpdatedEvent } from '@ultimatebackend/core';
import { cleanEmptyProperties } from '@ultimatebackend/common';
import { UpdateProjectCommand } from '../../impl';
import { RpcException } from '@nestjs/microservices';
import {
  Project,
  UpdateProjectResponse,
} from '@ultimatebackend/proto-schema/project';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler
  implements ICommandHandler<UpdateProjectCommand> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  public constructor(private readonly eventBus: EventBus) {}

  async execute(command: UpdateProjectCommand): Promise<UpdateProjectResponse> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${command.constructor.name}...`);
    const { input, projectRepository } = command;
    this.projectRepository = projectRepository;

    try {
      if (input === null) {
        // Check to make sure input is not null
        throw new RpcException('Project input name missing'); // Throw an apollo input error
      }

      if (input.id === null) {
        // Check to make sure input is not null
        throw new RpcException('Project to update id input missing'); // Throw an apollo input error
      }

      const { id, ...data } = input;
      const update = cleanEmptyProperties(data);

      const project = await this.projectRepository.findOneAndUpdate({
        conditions: { id: input.id },
        updates: {
          $set: { ...update },
        },
        upsert: false,
      });

      await this.eventBus.publish(new ProjectUpdatedEvent(project));

      return {
        project: (project as unknown) as Project,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
