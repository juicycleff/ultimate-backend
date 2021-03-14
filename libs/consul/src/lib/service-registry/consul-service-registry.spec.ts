import { ConsulServiceRegistry } from './consul-service-registry';
import { Test } from '@nestjs/testing';
import { ConsulModule } from '../../';
import { ConsulDiscoveryClient } from '../discovery';
import { SERVICE_REGISTRY_CONFIG, ServiceStore } from '@ultimate-backend/common';

describe('ConsulServiceRegistry', () => {
  let registry: ConsulServiceRegistry;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConsulModule.forRoot({
          host: 'localhost',
          port: '8350',
          aclToken: 'access-token',
        }),
      ],
      providers: [
        ConsulServiceRegistry,
        ConsulDiscoveryClient,
        ServiceStore,
        {
          provide: SERVICE_REGISTRY_CONFIG,
          useValue: {
            discoverer: 'consul',
            service: {
              id: 'example',
              port: 3333,
              name: 'example',
              address: 'localhost',
              tags: ['svc'],
            },
            discovery: {
              scheme: 'http',
            },
            heartbeat: {
              enabled: true,
              ttlInSeconds: 60,
            },
          },
        },
      ],
    }).compile();

    registry = module.get(ConsulServiceRegistry);
  });

  it('should be defined', () => {
    expect(registry).toBeTruthy();
  });
});
