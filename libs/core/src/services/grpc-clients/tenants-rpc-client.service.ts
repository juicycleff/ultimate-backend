import { Injectable } from '@nestjs/common';
import { GrpcClient, RpcClient, Service } from '@nestcloud/grpc';
import { join } from 'path';
import { TenantServiceClient } from '@ultimatebackend/proto-schema/tenant';
import { SERVICE_LIST } from '../../constants';

@Injectable()
export class TenantsRpcClientService {
  @RpcClient({
    service: SERVICE_LIST.tenant.consulName,
    package: SERVICE_LIST.tenant.package,
    protoPath: SERVICE_LIST.tenant.protoPath,
  })
  private readonly client: GrpcClient;

  @Service(SERVICE_LIST.tenant.service, {
    service: SERVICE_LIST.tenant.consulName,
    package: SERVICE_LIST.tenant.package,
    protoPath: SERVICE_LIST.tenant.protoPath,
  })
  public svc: TenantServiceClient<any>;
}
