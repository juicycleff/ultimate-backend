import { Injectable } from '@nestjs/common';
import { GrpcClient, RpcClient, Service } from '@nestcloud/grpc';
import { join } from 'path';
import { AccountServiceClient } from '@ultimatebackend/proto-schema/account';
import { SERVICE_LIST } from '../../constants';

@Injectable()
export class AccountsRpcClientService {
  @RpcClient({
    service: SERVICE_LIST.account.consulName,
    package: SERVICE_LIST.account.package,
    protoPath: SERVICE_LIST.account.protoPath,
  })
  private readonly client: GrpcClient;

  @Service(SERVICE_LIST.account.service, {
    service: SERVICE_LIST.account.consulName,
    package: SERVICE_LIST.account.package,
    protoPath: SERVICE_LIST.account.protoPath,
  })
  public svc: AccountServiceClient<any>;
}
