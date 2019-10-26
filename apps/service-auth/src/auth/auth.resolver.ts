import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { UserInputError } from 'apollo-server-express';
import { AuthService } from './auth.service';
import { AuthPayload, LoginInput, RegisterInput } from '../graphql';

@Resolver('AuthPayload')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
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
    const entity = await context.authenticate('graphql-local', { email: identifier, password });
    context.login(entity.user);

    return {
      id: entity.user.auth.id,
      user: entity.user.user,
    };
  }

  @Mutation('register')
  async register(@Args('input') cmd: RegisterInput, @Context() context: any) {
    const { auth, user } = await this.authService.register(cmd);

    context.login(user);
    return {
      id: auth.id,
      user,
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
