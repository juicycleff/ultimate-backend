import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksMutationResolver } from './webhooks-mutation.resolver';

describe('WebhooksMutationResolver', () => {
  let resolver: WebhooksMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhooksMutationResolver],
    }).compile();

    resolver = module.get<WebhooksMutationResolver>(WebhooksMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
