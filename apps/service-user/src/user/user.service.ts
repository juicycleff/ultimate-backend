import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { CreateUserCommand, GetUserQuery } from '@graphqlcqrs/core/cqrs';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * @description This function checks to see an auth entity exists
   * @return {Promise<UserEntity>} Result from the get
   * @access public
   * @memberOf UserService
   * @param {FindConditions<UserEntity>} where
   */
  async exist(where: FindConditions<UserEntity>): Promise<boolean> {
    return null; // return await this.queryBus.execute(new UserExistQuery(where));
  }

  /**
   * @description This query finds one user using QueryBus
   * @return {Promise<UserEntity>} Result from the get
   * @access public
   * @memberOf UserService
   * @param where
   */
  async findOne(where: FindConditions<UserEntity>): Promise<UserEntity> {
    return await this.queryBus.execute(new GetUserQuery(where));
  }

  /**
   * @description EventBus command to create a new user
   * @param {UserEntity} entity - User object
   * @return {Promise<UserEntity>} Result from the find
   * @access public
   * @memberOf UserService
   */
  async create(entity: UserEntity): Promise<UserEntity> {
    return await this.commandBus.execute(new CreateUserCommand(entity));
  }
}
