import { Injectable } from '@nestjs/common';
import { GrpcClient, RpcClient, Service } from '@nestcloud/grpc';
import { WebhookServiceClient } from '@ultimatebackend/proto-schema/webhook';
import { SERVICE_LIST } from '../../constants';

@Injectable()
export class WebhooksRpcClientService {
  @RpcClient({
    service: SERVICE_LIST.webhook.consulName,
    package: SERVICE_LIST.webhook.package,
    protoPath: SERVICE_LIST.webhook.protoPath,
  })
  private readonly client: GrpcClient;

  @Service(SERVICE_LIST.webhook.service, {
    service: SERVICE_LIST.webhook.consulName,
    package: SERVICE_LIST.webhook.package,
    protoPath: SERVICE_LIST.webhook.protoPath,
  })
  public svc: WebhookServiceClient<any>;
}
