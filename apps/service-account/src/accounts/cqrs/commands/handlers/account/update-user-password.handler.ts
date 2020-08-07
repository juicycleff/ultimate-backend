import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UserEntity, UserRepository } from '@ultimatebackend/repository';
import { UserPasswordUpdatedEvent } from '@ultimatebackend/core';
import { UpdatePasswordResponse } from '@ultimatebackend/proto-schema/account';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  generateHashedPassword,
  ValidationError,
  validPassword,
} from '@ultimatebackend/common';
import { UpdateUserPasswordCommand } from '../../impl';

/**
 * @implements {ICommandHandler<UpdateUserPasswordCommand>}
 * @classdesc CQRS command to update user entity
 * @class
 */
@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler
  implements ICommandHandler<UpdateUserPasswordCommand> {
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

  async execute(
    command: UpdateUserPasswordCommand,
  ): Promise<UpdatePasswordResponse> {
    this.logger.log(`Async ${command.constructor.name}...`);
    const { cmd } = command;

    try {
      const condition = {
        id: cmd.userId,
      };

      if (cmd.newPassword !== cmd.confirmPassword) {
        throw new RpcException('Your passwords do not match');
      }

      const user: UserEntity = await this.userRepository.findOne(
        condition,
        true,
      );
      if (!user) {
        throw new RpcException('Your password reset request has failed');
      }

      if (cmd.oldPassword !== 'reset') {
        if (!validPassword(cmd.oldPassword, user.services.password.hashed)) {
          throw new ValidationError('Your passwords do not match');
        }
      }

      const newUser = await this.userRepository.findOneByIdAndUpdate(
        cmd.userId,
        {
          updates: {
            $set: {
              'services.password.hashed': generateHashedPassword(
                cmd.newPassword,
              ),
            },
          },
        },
      );

      this.eventBus.publish(new UserPasswordUpdatedEvent(newUser));
      return {
        success: true,
      };
    } catch (error) {
      this.logger.log(error);
      throw new RpcException(error);
    }
  }
}
