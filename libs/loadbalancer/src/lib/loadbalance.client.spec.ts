import { Test } from '@nestjs/testing';
import { LoadBalancerClient } from './loadbalance.client';

describe('LoadBalancerClient', () => {
  let service: LoadBalancerClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LoadBalancerClient],
    }).compile();

    service = module.get(LoadBalancerClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
