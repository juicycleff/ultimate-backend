import { Test } from '@nestjs/testing';
import { KubernetesClient } from './kubernetes.client';
import { KUBERNETES_CONFIG_OPTIONS } from './kubernetes.constant';
import { KubernetesModuleOptions } from './kubernetes-module.options';
import { KubernetesConfig } from './kubernetes.config';

describe('KubernetesClient', () => {
  let service: KubernetesClient;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: KUBERNETES_CONFIG_OPTIONS,
          useValue: {
            k8sOptions: null,
          } as KubernetesModuleOptions,
        },
        KubernetesConfig,
        KubernetesClient,
      ],
    }).compile();

    await module.init();
    service = module.get(KubernetesClient);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('it can get namespaces', async () => {
    const nss = await service.client.listNamespace();
    expect(nss).toBeDefined();
  });
});
