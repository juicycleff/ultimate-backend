import { ServiceRegistration } from '../../index';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KubernetesRegistration } from './kubernetes-registration';

export class KubernetesServiceRegistry implements ServiceRegistration<KubernetesRegistration>, OnModuleInit, OnModuleDestroy {
  close(): void {
    // TODO: handle close
  }

  deregister(registration: KubernetesRegistration): Promise<void> {
    return Promise.resolve(undefined);
  }

  getStatus<T>(registration: KubernetesRegistration): Promise<T> {
    return Promise.resolve(undefined);
  }

  onModuleDestroy(): any {
    // TODO: handle
  }

  onModuleInit(): any {
    // TODO: handle
  }

  register(registration: KubernetesRegistration): Promise<void> {
    return Promise.resolve(undefined);
  }

  setStatus(registration: KubernetesRegistration, status: string): Promise<void> {
    return Promise.resolve(undefined);
  }

}
