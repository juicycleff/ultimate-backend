import {Logger} from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UserRepository, UserEntity } from '@graphqlcqrs/repository';
import { CreateUserCommand } from '../../impl';
import { UserCreatedEvent } from '../../../';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    Logger.log('Async CreateUserHandler...', 'CreateUserCommand');
    const { user } = command;

    try {
      const result = await this.userRepository.create(user);
      this.eventBus.publish(new UserCreatedEvent(result));
      return result;
    } catch (error) {
      Logger.log(error, 'CreateAuthHandler');
    }
  }

}
