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
import { GqlAuthGuard } from '@ultimatebackend/core';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { IdentifyMachineUtils } from '@ultimatebackend/common/utils/identify-machine.utils';
import { AccountsService } from './accounts.service';
import { Observable } from 'rxjs';
import { LoginServiceTypes, CreateRequest } from '@ultimatebackend/proto-schema/account';

@Resolver(() => AccountMutations)
export class AccountsMutationResolver {
  logger = new Logger(this.constructor.name);

  constructor(private readonly services: AccountsService) {}

  @ResolveField(() => Account)
  async login(
    @Args('input') { service, params }: LoginInput,
    @Context() context: any): Promise<Account> {

    // Graphql input validation checks start
    const validationErrors = {};
    if (!service) {
      validationErrors[service] = 'MISSING_VALUE';
      throw new UserInputError('Missing user login service type', { validationErrors });
    }
    const serviceType: ServiceTypes = ServiceTypes[service as unknown as string];
    this.logger.log(serviceType);

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

    if (serviceType === ServiceTypes.Password) {

      // Authenticate against passport local strategy
      const auth = await context.authenticate('graphql-local', { email: params.email, password: params.password });
      auth.user.whoImI = new IdentifyMachineUtils(context.req).sender();
      context.login(auth.user);

      return {
        id: auth.user.id,
        user: auth.user,
      };
    }

    throw new ApolloError('This login service has not been implemented yet');
  }

  @ResolveField(() => AccountRegisterResponse)
  register(@Args('input') cmd: RegisterInput, @Context() context: any): Observable<AccountRegisterResponse> {
    const payload = {
      ...cmd,
      service: LoginServiceTypes.Password,
    };

    return this.services.accountRpcClient.accountService.create(CreateRequest.fromJSON(payload));
  }

  @ResolveField(() => BooleanPayload)
  sendResetPasswordEmail(@Args('email') email: string, @Context() context: any): Observable<BooleanPayload> {
    return this.services.accountRpcClient.accountService.forgotPassword({email});
  }

  @ResolveField(() => BooleanPayload)
  sendVerificationEmail(@Args('email') email: string, @Context() context: any): Observable<BooleanPayload> {
    return this.services.accountRpcClient.accountService.resendVerificationCode({email});
  }

  @ResolveField(() => BooleanPayload)
  @UseGuards(GqlAuthGuard)
  changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
    @Args('newPasswordConfirm') newPasswordConfirm: string,
    @Context() context: any): Observable<BooleanPayload> {
    throw new NotImplementedError('Not implemented');
  }

  @ResolveField(() => Account)
  refreshTokens(
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
    @Context() context: any): Observable<Account> {
    throw new NotImplementedError('Not implemented');
  }

  @ResolveField(() => BooleanPayload)
  verifyAccount(@Args('pincode') pincode: string, @Args('email') email: string, @Context() context: any): Observable<BooleanPayload> {
    return this.services.accountRpcClient.accountService.verifyAccount({pincode, email});
  }

  @ResolveField(() => ExpirableTokens)
  verifyExpireToken(@Args('token') token: number, @Args('token') email: string, @Context() context: any): Observable<ExpirableTokens> {
    throw new NotImplementedError('Not implemented');
  }

  @ResolveField(() => VerificationLinkInfo)
  verifyActivationLink(@Args('token') token: string, @Args('token') email: string, @Context() context: any): Observable<VerificationLinkInfo> {
    return this.services.accountRpcClient.accountService.verifyActivationLink({token});
  }

  @ResolveField(() => BooleanPayload)
  @UseGuards(GqlAuthGuard)
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
