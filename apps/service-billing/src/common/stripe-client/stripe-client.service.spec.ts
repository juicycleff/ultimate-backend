import { Test, TestingModule } from '@nestjs/testing';
import { StripeClientService } from './stripe-client.service';

describe('StripeClientService', () => {
  let service: StripeClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeClientService],
    }).compile();

    service = module.get<StripeClientService>(StripeClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
