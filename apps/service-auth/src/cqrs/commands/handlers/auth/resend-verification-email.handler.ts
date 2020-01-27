import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@graphqlcqrs/repository';
import { ApolloError } from 'apollo-server-express';
import { ResendVerificationEmailCommand } from '../../impl';
import { VerificationEmailSentEvent } from '@graphqlcqrs/core/cqrs';
import { BooleanPayload } from '@graphqlcqrs/core/dto';
import { NotFoundError, ValidationError } from '@graphqlcqrs/common/errors';
import { generateVerificationCode } from '@graphqlcqrs/common/utils/verification-code-generator';

@CommandHandler(ResendVerificationEmailCommand)
export class ResendVerificationEmailHandler implements ICommandHandler<ResendVerificationEmailCommand> {
  logger = new Logger(this.constructor.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ResendVerificationEmailCommand): Promise<BooleanPayload> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { email } = command;

    try {
      const user: UserEntity = await this.userRepository.findOne({
        emails: { $elemMatch: { address: email, primary: true } },
      }, true);

      if (!user) { throw new NotFoundError('No user with email address found'); }

      // Check if user is verified
      const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);
      if (userEmail.verified) {
        throw new ValidationError('Email already verified');
      }

      const updatedUser = await this.userRepository.findOneAndUpdate({
        conditions: {
          'emails.address': email,
        },
        updates: {
          $set: {
            'emails.$.verificationCode': generateVerificationCode(6, { type: 'number' }),
          },
        },
      });

      if (updatedUser) {
        this.eventBus.publish(new VerificationEmailSentEvent(updatedUser));
        return {
          success: true,
        };
      }

      return {
        success: false,
      };
    } catch (error) {
      this.logger.error(error);
      throw new ApolloError(error.message);
    }
  }

}
