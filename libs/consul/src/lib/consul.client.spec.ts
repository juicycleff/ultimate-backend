import { Test } from '@nestjs/testing';
import { ConsulClient } from './consul.client';
import { ConsulModuleOptions } from './consul-module.options';
import { CONSUL_CONFIG_OPTIONS } from './consul.constant';
import { ConsulConfig } from './consul.config';

describe('ConsulClient', () => {
  let service: ConsulClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CONSUL_CONFIG_OPTIONS,
          useValue: {
            host: 'localhost',
            aclToken: 'dgdgc',
            secure: false,
            port: '8500',
          } as ConsulModuleOptions,
        },
        ConsulConfig,
        ConsulClient,
      ],
    }).compile();

    service = module.get(ConsulClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
