import { Test } from '@nestjs/testing';
import { Consul } from './consul';

describe('ConsulService', () => {
  let service: Consul;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [Consul],
    }).compile();

    service = module.get(Consul);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
