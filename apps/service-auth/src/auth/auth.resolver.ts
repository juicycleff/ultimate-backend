import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {  UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@graphqlcqrs/core';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand, VerifyEmailCommand } from '@graphqlcqrs/core/cqrs';
import { IdentifyMachineUtils } from '@graphqlcqrs/common/utils/identify-machine.utils';
import { BooleanPayload, ServiceTypes } from '@ultimatebackend/contracts';
import { NotImplementedError } from '@graphqlcqrs/common';
import { AuthPayload, LoginInput, RegisterInput } from '../types';
import { AuthService } from './auth.service';

@Resolver(() => AuthPayload)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('input') { service, params }: LoginInput,
    @Context() context: any): Promise<AuthPayload> {

    const serviceType =  ServiceTypes[service];

    // Graphql input validation checks start
    const validationErrors = {};
    if (!service) {
      validationErrors[service] = 'MISSING_VALUE';
      throw new UserInputError('Missing user login service type', { validationErrors });
    }

    if (serviceType === ServiceTypes.Password) {
      if (!params.password || !params.email) {
        validationErrors[params.password || params.email] = 'MISSING_VALUE';
        throw new UserInputError('Missing user login password or email', { validationErrors });
      }
    } else {
      if (!params.accessToken || !params.accessTokenSecret) {
        validationErrors[params.accessToken || params.accessTokenSecret] = 'MISSING_VALUE';
        throw new UserInputError(`Missing user access token or secret for ${service.toString().toLowerCase()} strategy`, { validationErrors });
      }
    }

    if (service === ServiceTypes.Password) {

      // Authenticate against passport local strategy
      const auth = await context.authenticate('graphql-local', { email: params.email, password: params.password });

      auth.user.whoImI = new IdentifyMachineUtils(context.req).sender();
      context.login(auth.user);

      return {
        id: auth.user.id,
        sessionId: context.req.sessionID,
      };
    }

    throw new ApolloError('This login service has not been implemented yet');
  }

  @Mutation(() => BooleanPayload)
  async register(@Args('input') cmd: RegisterInput, @Context() context: any): Promise<BooleanPayload> {
    return await this.commandBus.execute(new RegisterUserCommand(cmd));
  }

  @Mutation(() => BooleanPayload)
  async sendResetPasswordEmail(@Args('email') email: string, @Context() context: any): Promise<BooleanPayload> {
    throw new NotImplementedError('Not implemented');
    return null;
  }

  @Mutation(() => BooleanPayload)
  async sendVerificationEmail(@Args('email') email: string, @Context() context: any): Promise<BooleanPayload> {
    throw new NotImplementedError('Not implemented');
    return null;
  }

  @Mutation(() => BooleanPayload)
  async changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
    @Args('newPasswordConfirm') newPasswordConfirm: string,
    @Context() context: any): Promise<BooleanPayload> {
    throw new NotImplementedError('Not implemented');
    return null;
  }

  @Mutation(() => AuthPayload)
  async refreshTokens(
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
    @Context() context: any): Promise<AuthPayload> {
    throw new NotImplementedError('Not implemented');
    return null;
  }

  @Mutation(() => BooleanPayload)
  async verifyEmail(@Args('token') token: number, @Args('email') email: string, @Context() context: any): Promise<BooleanPayload> {
    return await this.commandBus.execute(new VerifyEmailCommand(token, email));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BooleanPayload)
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
