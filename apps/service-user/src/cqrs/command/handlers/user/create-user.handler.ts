import {Logger} from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UserRepository, UserEntity } from '@graphqlcqrs/repository';
import { CreateUserCommand } from '../../impl';
import { UserCreatedEvent } from '@graphqlcqrs/core';
import { ApolloError } from 'apollo-server-express';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { user } = command;

    try {
      const result = await this.userRepository.create(user);
      this.eventBus.publish(new UserCreatedEvent(result));
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error);
    }
  }

}
