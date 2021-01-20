import { ConsulServiceRegistry } from './consul-service-registry';
import { Test } from '@nestjs/testing';
import { ConsulModule } from '@ultimate-backend/consul';
import { ConsulDiscoveryClient } from './consul-discovery-client';
import { CLOUD_REGISTRY_CONFIG, RegistryConfiguration } from '../../';

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
        {
          provide: CLOUD_REGISTRY_CONFIG,
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
          } as RegistryConfiguration,
        },
      ],
    }).compile();

    registry = module.get(ConsulServiceRegistry);
  });

  it('should be defined', () => {
    expect(registry).toBeTruthy();
  });
});
