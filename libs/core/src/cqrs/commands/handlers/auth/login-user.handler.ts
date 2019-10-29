import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@graphqlcqrs/repository';
import { ApolloError } from 'apollo-server-express';
import { validPassword } from '@graphqlcqrs/common/utils';
import { ValidationError } from '@graphqlcqrs/common/exceptions';
import { LoginUserCommand } from '../../impl';
import { UserLoggedInEvent } from '../../../';
import { ServiceTypes } from '@graphqlcqrs/core/dto';

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
      let condition = {};
      if (cmd.service === ServiceTypes.Password) {
        condition = {
          emails: { $elemMatch: { address: cmd.params.email, primary: true } },
        };
      } else if (cmd.service === ServiceTypes.Google) {
        condition = {
          'services.google.accessToken': cmd.params.accessToken,
          'services.google.accessSecret': cmd.params.accessToken,
        };
      } else if (cmd.service === ServiceTypes.Facebook) {
        condition = {
          'services.facebook.accessToken': cmd.params.accessToken,
          'services.facebook.accessSecret': cmd.params.accessToken,
        };
      } else {
        condition = {
          emails: { $elemMatch: { address: cmd.params.email, primary: true } },
        };
      }

      const user: UserEntity = await this.userRepository.findOne(condition);

      if (cmd.service === ServiceTypes.Password) {
        if (!validPassword(cmd.params.password, user.services.password.hashed)) {
          throw new ValidationError(['Your login credentials were not correct']);
        }

        // Check if user is verified
        const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);
        if (!userEmail.verified) {
          throw new ValidationError(['Please verify your email address']);
        }
      }

      this.eventBus.publish(new UserLoggedInEvent(user));
      return user;
    } catch (error) {
      Logger.log(error, 'LoginUserHandler');
      throw new ApolloError(error.message);
    }
  }

}
