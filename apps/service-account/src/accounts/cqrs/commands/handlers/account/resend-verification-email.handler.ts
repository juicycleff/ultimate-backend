import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@ultimatebackend/repository';
import { ResendVerificationEmailCommand } from '../../impl';
import { VerificationEmailSentEvent } from '@ultimatebackend/core/cqrs';
import { generateVerificationCode } from '@ultimatebackend/common/utils/verification-code-generator';
import { RpcException } from '@nestjs/microservices';
import { ResendVerificationCodeResponse } from '@ultimatebackend/proto-schema/account';
import { JwtService } from '@nestjs/jwt';

/**
 * @implements {ICommandHandler<ResendVerificationCodeResponse>}
 * @classdesc CQRS command to resend verification email
 * @class
 */
@CommandHandler(ResendVerificationEmailCommand)
export class ResendVerificationEmailHandler
  implements ICommandHandler<ResendVerificationEmailCommand> {
  logger = new Logger(this.constructor.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description This method is called by the CQRS module
   * @param command
   * @return {ResendVerificationCodeResponse}
   */
  async execute(
    command: ResendVerificationEmailCommand,
  ): Promise<ResendVerificationCodeResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { email } = command;

    try {
      const user: UserEntity = await this.userRepository.findOne(
        {
          emails: { $elemMatch: { address: email, primary: true } },
        },
        true,
      );

      if (!user) {
        throw new RpcException('No user with email address found');
      }

      // Check if user is verified.
      const userEmail = user.emails.reduce(
        (previousValue) => previousValue.primary === true && previousValue,
      );
      if (userEmail.verified) {
        throw new RpcException('Email already verified');
      }

      /** Generate verification pin code for our user. */
      const pincode = generateVerificationCode(6, { type: 'string' });

      /** Update the user replacing old pin code with the new pin code. */
      const updatedUser: UserEntity & {
        activationLink?: string;
      } = await this.userRepository.findOneAndUpdate({
        conditions: {
          'emails.address': email,
        },
        updates: {
          $set: {
            'emails.$.verificationCode': pincode,
          },
        },
      });

      /** Encode user email and send it back as response to user.
       *  This token expires after 1h.
       */
      const payload = { email, pincode };
      const jwtCode = this.jwtService.sign(payload, { expiresIn: '1h' });
      const activationLink = `${jwtCode}`;

      /** Publish user created event if user was updated */
      if (updatedUser) {
        /** Attach the activation link for the event. This is important for the
         * notification service to properly send activation emails.
         */
        updatedUser.activationLink = activationLink;

        this.eventBus.publish(new VerificationEmailSentEvent(updatedUser));

        /** Returns request successful completion status */
        return { success: true };
      }

      /** Returns request successful completion status */
      return { success: false };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
