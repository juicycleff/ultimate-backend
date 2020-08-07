import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '@ultimatebackend/repository';
import { AuthenticationError } from 'apollo-server-express';
import * as Account from '@ultimatebackend/proto-schema/account';
import { AccountsRpcClientService } from '@ultimatebackend/core';

@Injectable()
export class AccountsService {
  logger = new Logger(this.constructor.name);

  constructor(readonly accountRpcClient: AccountsRpcClientService) {}

  /**
   * @description EventBus command to create a new user
   * @return {Promise<UserEntity>} Result from the find
   * @access public
   * @memberOf AccountsService
   * @param input
   */
  private async loginCmd(
    input: Account.LoginRequest,
  ): Promise<Account.LoginResponse> {
    // @ts-ignore
    try {
      const response = await this.accountRpcClient.svc
        .login(input, null)
        .toPromise();
      this.logger.log(response);
      return response;
    } catch (e) {
      this.logger.log(e);
      throw new Error(e.message);
    }
  }

  /**
   * @description EventBus command to create a new user
   * @return {Promise<UserEntity>} Result from the find
   * @access public
   * @memberOf AccountsService
   * @param input
   */
  private async createUser(
    input: Account.CreateRequest,
  ): Promise<Account.CreateResponse> {
    // @ts-ignore
    try {
      const response = await this.accountRpcClient.svc
        .create(input, null)
        .toPromise();
      this.logger.log(response);
      return response;
    } catch (e) {
      this.logger.log(e);
      throw new Error(e.message);
    }
  }

  /**
   * @description Validate a user by email and password
   * @return {Promise<UserEntity>} Result from the validation
   * @access public
   * @memberOf AccountsService
   * @param input
   */
  public async validateUser(
    input: Account.LoginRequest,
  ): Promise<Account.User> {
    try {
      const result = await this.loginCmd(input);
      return result.user;
    } catch (e) {
      this.logger.log(e);
      throw new AuthenticationError(e.message);
    }
  }

  /**
   * @description Validate a user by email and password
   * @return {Promise<UserEntity>} Result from the validation
   * @access public
   * @memberOf AccountsService
   * @param logCmd
   * @param regCmd
   */
  public async validateOrCreateUser(
    logCmd: Account.LoginRequest,
    regCmd: Account.CreateRequest,
  ): Promise<Account.User> {
    let user = null;
    await this.loginCmd(logCmd)
      .then((value) => {
        if (value) {
          user = value.user;
        }
      })
      .catch((reason) => {
        this.logger.error(reason);
      });

    if (user) {
      return user;
    }

    try {
      await this.createUser(regCmd);
      const result = await this.loginCmd(logCmd);
      return result.user;
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  }
}
