import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@graphqlcqrs/repository';
import { ApolloError } from 'apollo-server-express';
import { VerifyEmailCommand } from '../../impl';
import { EmailVerifiedEvent } from '../../../';
import { BooleanPayload } from '@graphqlcqrs/core/dto';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<BooleanPayload> {
    Logger.log('Async VerifyEmailHandler...', 'VerifyEmailCommand');
    const { code, email } = command;

    try {
      const user: UserEntity = await this.userRepository.findOne({
        emails: { $elemMatch: { address: email, primary: true, verificationCode: code } },
      }, true);

      if (!user) { throw new ApolloError('Invalid verification code'); }

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
        return {
          success: true,
        };
      }

      return {
        success: false,
      };
    } catch (error) {
      Logger.log(error, 'VerifyEmailHandler');
      throw new ApolloError(error.message);
    }
  }

}
