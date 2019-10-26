import { Injectable, Logger } from '@nestjs/common';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { AuthEntity, UserEntity } from '@graphqlcqrs/repository/entities';
import { AppLogger } from '@graphqlcqrs/common/services/app-logger.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterInput } from '../graphql';
import { AuthExistQuery, CreateAuthCommand, CreateUserCommand, GetAuthQuery, GetUserQuery } from '@graphqlcqrs/core/cqrs';
import { generateVerificationCode } from '@graphqlcqrs/common/utils/verification-code-generator';
import { ValidationError } from '@graphqlcqrs/common/exceptions';
import { validPassword } from '@graphqlcqrs/common/utils';
import { FindConditions } from '@graphqlcqrs/common/helpers/find-condtion.type';
import { ObjectID } from 'mongodb';

@Injectable()
export class AuthService {

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private logger: AppLogger,
  ) {}

  async register(cmd: RegisterInput): Promise<{ auth: AuthEntity, user: UserEntity}> {

    try {

      /* EVENT SOURCE START */
      const authExist: boolean = await this.exist({
        local: {
          email: cmd.email,
        },
      });

      if (authExist) {
        throw new ApolloError('User with this authentication method already exist');
      }

      // @ts-ignore
      const user: UserEntity = await this.createUser({
        firstname: cmd.firstname,
        lastname: cmd.lastname,
        email: cmd.email,
      });

      // @ts-ignore
      const auth: AuthEntity = await this.create({
        local: {
          hashedPassword: cmd.password,
          email: cmd.email,
        },
        emailVerification: generateVerificationCode(6, { type: 'number' }),
        userId: new ObjectID(user.id),
      });

      return {
        user,
        auth,
      };
    } catch (e) {
      this.logger.log(e);
      throw new ApolloError(e.message);
    }
  }

  async create(entity: AuthEntity): Promise<AuthEntity> {
    return await this.commandBus.execute(new CreateAuthCommand(entity));
  }

  /**
   * @description This function checks to see an auth entity exists
   * @return {Promise<AuthEntity>} Result from the get
   * @access public
   * @memberOf AuthService
   * @param {FindConditions<AuthEntity>} where
   */
  async exist(where: FindConditions<AuthEntity>): Promise<boolean> {
    return await this.queryBus.execute(new AuthExistQuery(where));
  }

  /**
   * @description This query finds one auth entity using QueryBus
   * @return {Promise<AuthEntity>} Result from the get
   * @access public
   * @memberOf AuthService
   * @param where
   */
  async findOne(where: FindConditions<AuthEntity>): Promise<AuthEntity> {
    return await this.queryBus.execute(new GetAuthQuery(where));
  }

  /**
   * @description EventBus command to create a new user
   * @param {UserEntity} entity - User object
   * @return {Promise<UserEntity>} Result from the find
   * @access public
   * @memberOf AuthService
   */
  async createUser(entity: UserEntity): Promise<UserEntity> {
    return await this.commandBus.execute(new CreateUserCommand(entity));
  }

  /**
   * @description QueryBus query to find a User
   * @param {FindConditions<UserEntity>} where - Query conditions
   * @return {Promise<UserEntity>} Result from the find
   * @access public
   * @memberOf AuthService
   */
  public async findOneUser(where: FindConditions<UserEntity>): Promise<UserEntity> {
    return await this.queryBus.execute(new GetUserQuery(where));
  }

  /**
   * @description Validate a user by email and password
   * @return {Promise<UserEntity>} Result from the validation
   * @access public
   * @memberOf AuthService
   * @param {string} email
   * @param {string} password
   */
  public async validateUser(email: string, password: string): Promise<{user: UserEntity, auth: AuthEntity}> {

    try {
      const auth: AuthEntity = await this.findOne({
        local: {
          email,
        },
      });

      if (!validPassword(password, auth.local.hashedPassword)) {
        throw new ValidationError(['Your login credentials were not correct']);
      }

      const user = await this.findOneUser({
        id: auth.userId,
      });

      return {
        user,
        auth,
      };
    } catch (e) {
      Logger.log(e, 'ValidateUser');
      throw new AuthenticationError(e.message);
    }
  }
}
