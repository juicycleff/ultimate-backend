import {Logger} from '@nestjs/common';
import {CommandHandler, ICommandHandler, EventBus} from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@graphqlcqrs/repository';
import { validPassword } from '@graphqlcqrs/common/utils';
import { ValidationError } from '@graphqlcqrs/common/exceptions';
import { LoginUserCommand } from '../../impl';
import { UserLoggedInEvent } from '../../../';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginUserCommand): Promise<UserEntity> {
    Logger.log('Async LoginUserHandler...', 'LoginUserCommand');
    const { cmd } = command;

    try {
      const user: UserEntity = await this.userRepository.findOne({
        emails: { $elemMatch: { address: cmd.identifier, primary: true } },
      });

      if (!validPassword(cmd.password, user.services.password.hashed)) {
        throw new ValidationError(['Your login credentials were not correct']);
      }

      // Check if user is verified
      const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);
      if (!userEmail.verified) {
        throw new ValidationError(['Please verify your email address']);
      }

      this.eventBus.publish(new UserLoggedInEvent(user));
      return user;
    } catch (error) {
      Logger.log(error, 'LoginUserHandler');
    }
  }

}
