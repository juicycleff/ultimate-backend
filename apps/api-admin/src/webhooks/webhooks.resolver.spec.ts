import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksResolver } from './webhooks.resolver';

describe('WebhooksResolver', () => {
  let resolver: WebhooksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhooksResolver],
    }).compile();

    resolver = module.get<WebhooksResolver>(WebhooksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
