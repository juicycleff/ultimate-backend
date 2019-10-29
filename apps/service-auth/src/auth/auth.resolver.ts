import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/common/guards';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { AuthService } from './auth.service';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand, VerifyEmailCommand } from '@graphqlcqrs/core/cqrs';
import { AuthPayload, BooleanPayload, LoginInput, RegisterInput, ServiceTypes } from '@graphqlcqrs/core/dto';
import { IdentifyMachineUtils } from '@graphqlcqrs/common/utils/identify-machine.utils';

@Resolver('AuthPayload')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation('login')
  async login(@Args('input') input: LoginInput, @Context() context: any): Promise<AuthPayload> {

    // Graphql input validation checks start
    const validationErrors = {};
    if (!input.service) {
      validationErrors[input.service] = 'MISSING_VALUE';
      throw new UserInputError('Missing user login service type', { validationErrors });
    }

    if (input.service === ServiceTypes.Password) {
      if (!input.params.password || !input.params.email) {
        validationErrors[input.params.password || input.params.email] = 'MISSING_VALUE';
        throw new UserInputError('Missing user login password or email', { validationErrors });
      }
    } else {
      if (!input.params.accessToken || !input.params.accessTokenSecret) {
        validationErrors[input.params.accessToken || input.params.accessTokenSecret] = 'MISSING_VALUE';
        throw new UserInputError(`Missing user access token or secret for ${input.service.toString().toLowerCase()} strategy`, { validationErrors });
      }
    }
    // Graphql input validation checks end

    if (input.service === ServiceTypes.Password) {

      // Authenticate against passport local strategy
      const auth = await context.authenticate('graphql-local', { email: input.params.email, password: input.params.password });

      auth.user.whoImI = new IdentifyMachineUtils(context.req).sender();
      context.login(auth.user);

      return {
        id: auth.user.id,
        sessionId: context.req.sessionID,
      };
    }

    throw new ApolloError('This login service has not been implemented yet');
  }

  @Mutation('register')
  async register(@Args('input') cmd: RegisterInput, @Context() context: any): Promise<AuthPayload> {
    const user = await this.commandBus.execute(new RegisterUserCommand(cmd));

    return {
      id: user.id,
    };
  }

  @Mutation('verifyEmail')
  async verifyEmail(@Args('token') token: number, @Args('email') email: string, @Context() context: any): Promise<BooleanPayload> {
    return await this.commandBus.execute(new VerifyEmailCommand(token, email));
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
