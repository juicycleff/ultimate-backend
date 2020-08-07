import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  VerifyEmailCommand,
  RegisterUserCommand,
  ResendVerificationEmailCommand,
  LoginUserCommand,
  GetUserQuery,
  ForgotPasswordCommand,
  UpdateUserPasswordCommand,
  UpdateUserCommand,
} from './cqrs';

import {
  AccountService,
  CreateRequest,
  CreateResponse,
  DeleteRequest,
  DeleteResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  ReadRequest,
  ReadResponse,
  ReadSessionRequest,
  ReadSessionResponse,
  ResendVerificationCodeRequest,
  ResendVerificationCodeResponse,
  SearchRequest,
  SearchResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateRequest,
  UpdateResponse,
  User,
  VerifyAccountRequest,
  VerifyAccountResponse,
  VerifyActivationLinkRequest,
  VerifyActivationLinkResponse,
} from '@ultimatebackend/proto-schema';
import { JwtService } from '@nestjs/jwt';

@Controller('accounts')
export class AccountsController implements AccountService<any> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  @GrpcMethod('AccountService')
  async create(request: CreateRequest, ctx: any): Promise<CreateResponse> {
    return await this.commandBus.execute(new RegisterUserCommand(request));
  }

  @GrpcMethod('AccountService')
  delete(request: DeleteRequest, ctx: any): Promise<DeleteResponse> {
    return undefined;
  }

  @GrpcMethod('AccountService')
  async login(request: LoginRequest, ctx: any): Promise<LoginResponse> {
    return await this.commandBus.execute(new LoginUserCommand(request));
  }

  @GrpcMethod('AccountService')
  logout(request: LogoutRequest, ctx: any): Promise<LogoutResponse> {
    return undefined;
  }

  @GrpcMethod('AccountService')
  async read(request: ReadRequest, ctx: any): Promise<ReadResponse> {
    if (!request.query) {
      throw new RpcException('Missing query params');
    }
    const user = (await this.queryBus.execute(
      new GetUserQuery(JSON.parse(request.query)),
    )) as User;
    // @ts-ignore
    return {
      user,
    };
  }

  @GrpcMethod('AccountService')
  async readSession(
    request: ReadSessionRequest,
    ctx: any,
  ): Promise<ReadSessionResponse> {
    return undefined;
  }

  @GrpcMethod('AccountService')
  search(request: SearchRequest, ctx: any): Promise<SearchResponse> {
    return undefined;
  }

  @GrpcMethod('AccountService')
  async resendVerificationCode(
    request: ResendVerificationCodeRequest,
    ctx: any,
  ): Promise<ResendVerificationCodeResponse> {
    return await this.commandBus.execute(
      new ResendVerificationEmailCommand(request.email),
    );
  }

  @GrpcMethod('AccountService')
  async update(request: UpdateRequest, ctx: any): Promise<UpdateResponse> {
    return await this.commandBus.execute(new UpdateUserCommand(null, request));
  }

  @GrpcMethod('AccountService')
  async updatePassword(
    request: UpdatePasswordRequest,
    ctx: any,
  ): Promise<UpdatePasswordResponse> {
    return await this.commandBus.execute(
      new UpdateUserPasswordCommand(request),
    );
  }

  @GrpcMethod('AccountService')
  async verifyAccount(
    request: VerifyAccountRequest,
    ctx: any,
  ): Promise<VerifyAccountResponse> {
    return await this.commandBus.execute(
      new VerifyEmailCommand(request.pincode, request.email),
    );
  }

  @GrpcMethod('AccountService')
  async verifyActivationLink(
    request: VerifyActivationLinkRequest,
    ctx: any,
  ): Promise<VerifyActivationLinkResponse> {
    try {
      const decoded = (await this.jwtService.decode(request.token)) as any;
      return {
        email: decoded.email,
        pincode: decoded.pincode,
      };
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @GrpcMethod('AccountService')
  async forgotPassword(
    request: ForgotPasswordRequest,
    ctx: any,
  ): Promise<ForgotPasswordResponse> {
    return await this.commandBus.execute(new ForgotPasswordCommand(request));
  }
}
