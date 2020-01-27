import { Injectable, Logger } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { LoginUserCommand } from '../cqrs';

import { CommandBus } from '@nestjs/cqrs';
import { LoginInput } from '@graphqlcqrs/core/dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * @description EventBus command to create a new user
   * @return {Promise<UserEntity>} Result from the find
   * @access public
   * @memberOf AuthService
   * @param input
   */
  private async loginCmd(input: LoginInput): Promise<UserEntity> {
    return await this.commandBus.execute(new LoginUserCommand(input));
  }

  /**
   * @description Validate a user by email and password
   * @return {Promise<UserEntity>} Result from the validation
   * @access public
   * @memberOf AuthService
   * @param input
   */
  public async validateUser(input: LoginInput): Promise<UserEntity> {
    try {
      return await this.loginCmd(input);
    } catch (e) {
      Logger.error(e, 'ValidateUser');
      throw new AuthenticationError(e.message);
    }
  }
}
