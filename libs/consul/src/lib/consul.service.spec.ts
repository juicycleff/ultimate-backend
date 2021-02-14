import { Test } from '@nestjs/testing';
import { ConsulService } from './consul.service';
import { ConsulModuleOptions } from './consul-module.options';
import { CONSUL_CONFIG_OPTIONS } from './consul.constant';

describe('ConsulService', () => {
  let service: ConsulService;

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
        ConsulService,
      ],
    }).compile();

    service = module.get(ConsulService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
