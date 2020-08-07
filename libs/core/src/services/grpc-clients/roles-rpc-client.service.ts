import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { RpcClient, GrpcClient, Service } from '@nestcloud/grpc';
import { RoleServiceClient } from '@ultimatebackend/proto-schema';
import { SERVICE_LIST } from '../../constants';

@Injectable()
export class RolesRpcClientService {
  @RpcClient({
    service: SERVICE_LIST.role.consulName,
    package: SERVICE_LIST.role.package,
    protoPath: SERVICE_LIST.role.protoPath,
  })
  private readonly client: GrpcClient;

  @Service(SERVICE_LIST.role.service, {
    service: SERVICE_LIST.role.consulName,
    package: SERVICE_LIST.role.package,
    protoPath: SERVICE_LIST.role.protoPath,
  })
  public svc: RoleServiceClient<any>;
}
