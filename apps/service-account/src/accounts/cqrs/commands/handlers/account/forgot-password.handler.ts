import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@ultimatebackend/repository';
import { ForgotPasswordSentEvent } from '@ultimatebackend/core';
import { ForgotPasswordCommand } from '../../impl';
import { ForgotPasswordResponse } from '@ultimatebackend/proto-schema/account';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

/**
 * @implements {ICommandHandler<ForgotPasswordCommand>}
 * @classdesc CQRS command to request password change
 * @class
 */
@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand> {
  logger = new Logger(this.constructor.name);

  /**
   * @constructor
   * @param userRepository
   * @param eventBus
   * @param jwtService
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description execute
   * @param command {ForgotPasswordCommand}
   */
  async execute(
    command: ForgotPasswordCommand,
  ): Promise<ForgotPasswordResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { cmd } = command;

    try {
      /** Check if user exist with email */
      const user: UserEntity & {
        resetPasswordLink?: string;
      } = await this.userRepository.findOne({
        'emails.address': cmd.email,
      });

      if (!user) {
        throw new RpcException('Email is not found');
      }

      const payload = { id: user.id };
      const jwtCode = this.jwtService.sign(payload, { expiresIn: '1h' });
      user.resetPasswordLink = `${jwtCode}`;

      this.eventBus.publish(new ForgotPasswordSentEvent(user));
      return {
        success: true,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
