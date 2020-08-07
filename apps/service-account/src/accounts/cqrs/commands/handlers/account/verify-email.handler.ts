import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@ultimatebackend/repository';
import { VerifyEmailCommand } from '../../impl';
import { RpcException } from '@nestjs/microservices';
import { EmailVerifiedEvent } from '@ultimatebackend/core/cqrs';
import * as Account from '@ultimatebackend/proto-schema';

/**
 * @class
 * @implements {ICommandHandler<VerifyEmailCommand>}
 */
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  logger = new Logger(this.constructor.name);

  /**
   * @constructor
   * @param userRepository {UserRepository}
   * @param eventBus {EventBus}
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * @param command {VerifyEmailCommand}
   */
  async execute(
    command: VerifyEmailCommand,
  ): Promise<Account.VerifyAccountResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { code, email } = command;

    try {
      const user: UserEntity = await this.userRepository.findOne(
        {
          emails: {
            $elemMatch: {
              address: email,
              primary: true,
              verificationCode: code,
            },
          },
        },
        true,
      );

      if (!user) {
        throw new RpcException('Invalid verification code');
      }

      const updatedUser = await this.userRepository.findOneAndUpdate({
        conditions: {
          'emails.address': email,
        },
        updates: {
          $set: {
            'emails.$.verificationCode': null,
            'emails.$.verified': true,
          },
        },
      });

      if (updatedUser) {
        this.eventBus.publish(new EmailVerifiedEvent(updatedUser));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
