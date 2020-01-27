import {Logger} from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UserRepository, UserEntity } from '@graphqlcqrs/repository';
import { UserCreatedEvent } from '@graphqlcqrs/core';
import { cleanEmptyProperties } from '@graphqlcqrs/common';
import { UpdateUserCommand } from '../../impl';
import { ApolloError } from 'apollo-server-express';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  logger = new Logger(this.constructor.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { data, id } = command;

    try {

      const update = cleanEmptyProperties(data);
      const user = await this.userRepository.findOneByIdAndUpdate(id, {
        updates: {
          $set: { ...update },
        },
      });
      this.eventBus.publish(new UserCreatedEvent(user));
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error);
    }
  }

}
