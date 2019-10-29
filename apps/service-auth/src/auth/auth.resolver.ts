import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { UserInputError } from 'apollo-server-express';
import { AuthService } from './auth.service';
import { AuthPayload, LoginInput, RegisterInput } from '../graphql';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '@graphqlcqrs/core/cqrs';

@Resolver('AuthPayload')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation('login')
  async login(@Args('input') {identifier, password}: LoginInput, @Context() context: any): Promise<AuthPayload> {
    /**
     * Graphql input validation checks
     */
    const validationErrors = {};
    if (!identifier) {
      validationErrors[identifier] = 'MISSING_VALUE';
      throw new UserInputError('Missing user login identifier', { validationErrors });
    }
    if (!password) {
      validationErrors[password] = 'MISSING_VALUE';
      throw new UserInputError('Missing user login password', { validationErrors });
    }

    // Authenticate against passport local strategy
    const auth = await context.authenticate('graphql-local', { email: identifier, password });
    context.login(auth.user);

    return {
      id: auth.user.id,
    };
  }

  @Mutation('register')
  async register(@Args('input') cmd: RegisterInput, @Context() context: any): Promise<AuthPayload> {
    const user = await this.commandBus.execute(new RegisterUserCommand(cmd));

    console.log(user);
    context.login(user);
    return {
      id: user.id,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('logout')
  async logout(@Context() context: any) {
    try {
      await context.logout();
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  }
}
