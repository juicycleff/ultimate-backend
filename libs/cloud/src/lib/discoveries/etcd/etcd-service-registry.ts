import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EtcdRegistration } from './etcd-registration';
import { ServiceRegistration } from '../../index';

export class EtcdServiceRegistry
  implements
    ServiceRegistration<EtcdRegistration>,
    OnModuleInit,
    OnModuleDestroy {
  close(): void {
    // TODO: handle close
  }

  deregister(registration: EtcdRegistration): Promise<void> {
    return Promise.resolve(undefined);
  }

  getStatus<T>(registration: EtcdRegistration): Promise<T> {
    return Promise.resolve(undefined);
  }

  onModuleDestroy(): any {
    // TODO: handle
  }

  onModuleInit(): any {
    // TODO: handle
  }

  register(registration: EtcdRegistration): Promise<void> {
    return Promise.resolve(undefined);
  }

  setStatus(registration: EtcdRegistration, status: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
