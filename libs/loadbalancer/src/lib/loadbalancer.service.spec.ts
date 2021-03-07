import { Test } from '@nestjs/testing';
import { LoadbalanceService } from './loadbalance.service';

describe('LoadBalancerService', () => {
  let service: LoadbalanceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LoadbalanceService],
    }).compile();

    service = module.get(LoadbalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
