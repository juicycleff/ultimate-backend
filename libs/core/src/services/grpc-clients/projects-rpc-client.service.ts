import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { RpcClient, GrpcClient, Service } from '@nestcloud/grpc';
import { ProjectServiceClient } from '@ultimatebackend/proto-schema/project';
import { SERVICE_LIST } from '../../constants';

@Injectable()
export class ProjectsRpcClientService {
  @RpcClient({
    service: SERVICE_LIST.project.consulName,
    package: SERVICE_LIST.project.package,
    protoPath: join(__dirname, SERVICE_LIST.project.protoPath),
  })
  private readonly projectClient: GrpcClient;

  @Service(SERVICE_LIST.project.service, {
    service: SERVICE_LIST.project.consulName,
    package: SERVICE_LIST.project.package,
    protoPath: join(__dirname, SERVICE_LIST.project.protoPath),
  })
  public project: ProjectServiceClient<any>;
}
