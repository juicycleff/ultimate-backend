import {Logger} from '@nestjs/common';
import {CommandHandler, ICommandHandler, EventPublisher} from '@nestjs/cqrs';
import { AuthRepository, AuthEntity } from '@graphqlcqrs/repository';
import { CreateAuthCommand } from '../../impl';

@CommandHandler(CreateAuthCommand)
export class CreateAuthHandler implements ICommandHandler<CreateAuthCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAuthCommand): Promise<AuthEntity> {
    Logger.log('Async CreateAuthHandler...', 'CreateAuthCommand');
    const { auth } = command;

    try {
      /* const temp = await this.authRepository.create(classToPlain(auth));
      const saved = await this.authRepository.store(temp);
      const result = plainToClass(AuthEntity, saved);
      const pub = this.publisher.mergeObjectContext(result);

      pub.notify(result);
      pub.commit();
      return result; */
      return null;
    } catch (error) {
      Logger.log(error, 'CreateAuthHandler');
    }
  }

}
