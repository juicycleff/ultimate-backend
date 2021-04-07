import { Test } from '@nestjs/testing';
import { LoadBalancerClient } from './loadbalance.client';
import { LoadbalancerConfig } from './loadbalancer.config';
import { LOAD_BALANCE_CONFIG_OPTIONS } from './loadbalancer.constant';
import { LoadBalancerModuleOptions } from '@ultimate-backend/loadbalancer';
import { ServiceStore } from '@ultimate-backend/common';
import { StrategyRegistry } from './strategy.registry';

describe('LoadBalancerClient', () => {
  let service: LoadBalancerClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: LOAD_BALANCE_CONFIG_OPTIONS,
          useValue: {} as LoadBalancerModuleOptions,
        },
        LoadbalancerConfig,
        ServiceStore,
        StrategyRegistry,
        LoadBalancerClient,
      ],
    }).compile();

    service = module.get(LoadBalancerClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
