import {Logger} from '@nestjs/common';
import {CommandHandler, ICommandHandler, EventBus} from '@nestjs/cqrs';
import { AuthRepository, AuthEntity } from '@graphqlcqrs/repository';
import { CreateAuthCommand } from '../../impl';
import { AuthCreatedEvent } from '../../../';

@CommandHandler(CreateAuthCommand)
export class CreateAuthHandler implements ICommandHandler<CreateAuthCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAuthCommand): Promise<AuthEntity> {
    Logger.log('Async CreateAuthHandler...', 'CreateAuthCommand');
    const { auth } = command;

    try {
      const result = await this.authRepository.create(auth);
      this.eventBus.publish(new AuthCreatedEvent(result));
      return result;
    } catch (error) {
      Logger.log(error, 'CreateAuthHandler');
    }
  }

}
