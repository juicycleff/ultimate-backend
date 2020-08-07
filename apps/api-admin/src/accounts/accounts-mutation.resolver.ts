import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import {
  Account,
  AccountMutations,
  AccountRegisterResponse,
  ExpirableTokens,
  LoginInput,
  RegisterInput,
  VerificationLinkInfo,
} from './types';
import { BooleanPayload, ServiceTypes } from '@ultimatebackend/contracts';
import { NotImplementedError } from '@ultimatebackend/common';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlContext } from '@ultimatebackend/core';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { IdentifyMachineUtils } from '@ultimatebackend/common/utils/identify-machine.utils';
import { Observable } from 'rxjs';
import {
  LoginServiceTypes,
  CreateRequest,
} from '@ultimatebackend/proto-schema/account';
import { User } from '../users/types';

@Resolver(() => AccountMutations)
export class AccountsMutationResolver {
  logger = new Logger(this.constructor.name);

  @ResolveField(() => Account)
  async login(
    @Args('input') { service, params }: LoginInput,
    @Context() ctx: GqlContext,
  ): Promise<Account> {
    // Graphql input validation checks start
    const validationErrors = {};
    if (!service) {
      validationErrors[service] = 'MISSING_VALUE';
      throw new UserInputError('Missing user login service type', {
        validationErrors,
      });
    }
    const serviceType: ServiceTypes =
      ServiceTypes[(service as unknown) as string];
    this.logger.log(serviceType);

    if (serviceType === ServiceTypes.Password) {
      if (!params.password || !params.email) {
        validationErrors[params.password || params.email] = 'MISSING_VALUE';
        throw new UserInputError('Missing user login password or email', {
          validationErrors,
        });
      }
    } else {
      if (!params.accessToken || !params.accessTokenSecret) {
        validationErrors[params.accessToken || params.accessTokenSecret] =
          'MISSING_VALUE';
        throw new UserInputError(
          `Missing user access token or secret for ${service
            .toString()
            .toLowerCase()} strategy`,
          { validationErrors },
        );
      }
    }

    if (serviceType === ServiceTypes.Password) {
      // Authenticate against passport local strategy
      const auth = await ctx.authenticate('graphql-local', {
        // @ts-ignore
        email: params.email,
        password: params.password,
      });
      // @ts-ignore
      auth.user.whoImI = new IdentifyMachineUtils(ctx.req).sender();
      // @ts-ignore
      ctx.login(auth.user);

      return {
        id: auth.user.id.toString(),
        user: (auth.user as unknown) as User,
      };
    }

    throw new ApolloError('This login service has not been implemented yet');
  }

  @ResolveField(() => AccountRegisterResponse)
  register(
    @Args('input') cmd: RegisterInput,
    @Context() ctx: GqlContext,
  ): Observable<AccountRegisterResponse> {
    const payload = {
      ...cmd,
      service: LoginServiceTypes.Password,
    };

    return ctx?.rpc?.account?.svc.create(CreateRequest.fromJSON(payload));
  }

  @ResolveField(() => BooleanPayload)
  sendResetPasswordEmail(
    @Args('email') email: string,
    @Context() ctx: GqlContext,
  ): Observable<BooleanPayload> {
    return ctx?.rpc?.account?.svc.forgotPassword({
      email,
    });
  }

  @ResolveField(() => BooleanPayload)
  sendVerificationEmail(
    @Args('email') email: string,
    @Context() ctx: GqlContext,
  ): Observable<BooleanPayload> {
    return ctx?.rpc?.account?.svc.resendVerificationCode({ email });
  }

  @ResolveField(() => BooleanPayload)
  changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
    @Args('newPasswordConfirm') newPasswordConfirm: string,
    @Context() ctx: GqlContext,
  ): Observable<BooleanPayload> {
    throw new NotImplementedError('Not implemented');
  }

  @ResolveField(() => Account)
  refreshTokens(
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
    @Context() ctx: GqlContext,
  ): Observable<Account> {
    throw new NotImplementedError('Not implemented');
  }

  @ResolveField(() => BooleanPayload)
  verifyAccount(
    @Args('pincode') pincode: string,
    @Args('email') email: string,
    @Context() ctx: GqlContext,
  ): Observable<BooleanPayload> {
    return ctx?.rpc?.account?.svc.verifyAccount({
      pincode,
      email,
    });
  }

  @ResolveField(() => ExpirableTokens)
  verifyExpireToken(
    @Args('token') token: number,
    @Args('token') email: string,
    @Context() ctx: GqlContext,
  ): Observable<ExpirableTokens> {
    throw new NotImplementedError('Not implemented');
  }

  @ResolveField(() => VerificationLinkInfo)
  verifyActivationLink(
    @Args('token') token: string,
    @Args('token') email: string,
    @Context() ctx: GqlContext,
  ): Observable<VerificationLinkInfo> {
    return ctx?.rpc?.account?.svc.verifyActivationLink({
      token,
    });
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => BooleanPayload)
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
