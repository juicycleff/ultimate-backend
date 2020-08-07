import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@ultimatebackend/repository';
import { validPassword } from '@ultimatebackend/common/utils';
import { UserLoggedInEvent } from '@ultimatebackend/core/cqrs';
import { NotFoundError, ValidationError } from '@ultimatebackend/common/errors';
import {
  LoginRequest,
  LoginResponse,
  LoginServiceTypes,
} from '@ultimatebackend/proto-schema/account';
import { LoginUserCommand } from '../../impl';
import { RpcException } from '@nestjs/microservices';

/**
 * @implements {ICommandHandler<LoginUserCommand>}
 * @classdesc CQRS command to login user
 * @class
 */
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  logger = new Logger(this.constructor.name);

  /**
   * @constructor
   * @param userRepository
   * @param eventBus
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { cmd } = command;

    this.logger.log(cmd);
    try {
      const condition = getLoginQuery(cmd);

      const user: UserEntity = await this.userRepository.findOne(
        condition,
        true,
      );
      if (!user) {
        throw new NotFoundError('Your login credentials is incorrect');
      }

      if (cmd.service === LoginServiceTypes.Password) {
        if (
          !validPassword(cmd.params.password, user.services.password.hashed)
        ) {
          throw new ValidationError('Your login credentials is incorrect');
        }

        // Check if user is verified
        const userEmail = user.emails.reduce(
          (previousValue) => previousValue.primary === true && previousValue,
        );
        if (!userEmail.verified) {
          throw new ValidationError('Please verify your email address');
        }
      }

      this.eventBus.publish(new UserLoggedInEvent(user));

      return {
        // @ts-ignore
        user: user as Account.User,
        session: undefined,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error.message);
    }
  }
}

function getLoginQuery(cmd: LoginRequest) {
  if (cmd.service === LoginServiceTypes.Password) {
    return {
      emails: { $elemMatch: { address: cmd.params.email, primary: true } },
    };
  } else if (cmd.service === LoginServiceTypes.Google) {
    return {
      emails: { $elemMatch: { address: cmd.params.email, primary: true } },
      'services.google.userId': cmd.params.accessToken,
    };
  } else if (cmd.service === LoginServiceTypes.Github) {
    return {
      $and: [
        {
          emails: { $elemMatch: { address: cmd.params.email, primary: true } },
        },
        { 'services.github.userId': cmd.params.userId },
      ],
    };
  } else if (cmd.service === LoginServiceTypes.Facebook) {
    return {
      emails: { $elemMatch: { address: cmd.params.email, primary: true } },
      'services.facebook.userId': cmd.params.userId,
    };
  } else {
    return {
      emails: { $elemMatch: { address: cmd.params.email, primary: true } },
    };
  }
}
