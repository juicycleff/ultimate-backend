import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@graphqlcqrs/repository';
import { ApolloError } from 'apollo-server-express';
import { validPassword } from '@graphqlcqrs/common/utils';
import { UserLoggedInEvent } from '@graphqlcqrs/core/cqrs';
import { ServiceTypes } from '@graphqlcqrs/core/dto';
import { NotFoundError, ValidationError } from '@graphqlcqrs/common/errors';
import { LoginUserCommand } from '../../impl';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  logger = new Logger(this.constructor.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginUserCommand): Promise<UserEntity> {
    this.logger.log(`Async ${command.constructor.name}...`);
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

      const user: UserEntity = await this.userRepository.findOne(condition, true);

      if (!user) {
        throw new NotFoundError('Your login credentials is incorrect');
      }

      if (cmd.service === ServiceTypes.Password) {
        if (!validPassword(cmd.params.password, user.services.password.hashed)) {
          throw new ValidationError('Your login credentials is incorrect');
        }

        // Check if user is verified
        const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);
        if (!userEmail.verified) {
          throw new ValidationError('Please verify your email address');
        }
      }

      this.eventBus.publish(new UserLoggedInEvent(user));
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message);
    }
  }

}
