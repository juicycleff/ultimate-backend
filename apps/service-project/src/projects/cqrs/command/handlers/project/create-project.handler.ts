import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@ultimatebackend/repository';
import { ProjectCreatedEvent } from '@ultimatebackend/core';
import { CreateProjectCommand } from '../../impl';
import { RpcException } from '@nestjs/microservices';
import {
  CreateProjectResponse,
  Project,
} from '@ultimatebackend/proto-schema/project';
import { ObjectId } from 'mongodb';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand> {
  logger = new Logger(this.constructor.name);
  projectRepository: ProjectRepository;

  public constructor(private readonly eventBus: EventBus) {}

  async execute(command: CreateProjectCommand): Promise<CreateProjectResponse> {
    this.logger = new Logger(this.constructor.name);
    this.logger.log(`Async ${command.constructor.name}...`);
    const { input, user, projectRepository } = command;
    this.projectRepository = projectRepository;

    try {
      if (input === null || input.name === null) {
        // Check to make sure input is not null
        throw new RpcException('Project input name missing'); // Throw an apollo input error
      }

      const project = await this.projectRepository.create({
        ...input,
        createdBy: new ObjectId(user.id),
      });

      await this.eventBus.publish(new ProjectCreatedEvent(project));

      return {
        project: Project.fromJSON(project),
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
