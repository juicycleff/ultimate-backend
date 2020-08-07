import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksRpcClientService } from './webhooks-rpc-client.service';

describe('WebhooksRpcClientService', () => {
  let service: WebhooksRpcClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhooksRpcClientService],
    }).compile();

    service = module.get<WebhooksRpcClientService>(WebhooksRpcClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
