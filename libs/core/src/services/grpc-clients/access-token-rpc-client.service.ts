import { Injectable } from '@nestjs/common';
import { GrpcClient, RpcClient, Service } from '@nestcloud/grpc';
import { AccessServiceClient } from '@ultimatebackend/proto-schema/access';
import { SERVICE_LIST } from '../../constants';

@Injectable()
export class AccessTokenRpcClientService {
  @RpcClient({
    service: SERVICE_LIST.access.consulName,
    package: SERVICE_LIST.access.package,
    protoPath: SERVICE_LIST.access.protoPath,
  })
  private readonly client: GrpcClient;

  @Service(SERVICE_LIST.access.service, {
    service: SERVICE_LIST.access.consulName,
    package: SERVICE_LIST.access.package,
    protoPath: SERVICE_LIST.access.protoPath,
  })
  public svc: AccessServiceClient<any>;
}
