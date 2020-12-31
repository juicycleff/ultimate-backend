import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { loadPackage } from '@nestjs/common/utils/load-package.util';
import {
  Service,
  IRegistry,
  DeregisterOption,
  GetOption,
  RegistryOption,
  ListOption,
  ServiceList,
  RegisterOption,
  WatchOption,
  SwineServiceOptions,
} from '../../interfaces';
import { Consul } from 'consul';

@Injectable()
export class ConsulRegistry
  implements IRegistry, OnModuleInit, OnModuleDestroy {
  constructor(private readonly consul: Consul, options: SwineServiceOptions) {}

  onModuleDestroy(): void {
    // TODO
  }

  onModuleInit(): void {
    // TODO
  }

  deregister(svc: Service, opts?: DeregisterOption): Service {
    return undefined;
  }

  getService(name: string, opts?: GetOption): Array<Service> {
    return undefined;
  }

  init(opts: RegistryOption): void {
    // TODO
  }

  listServices(opts?: ListOption): ServiceList {
    return undefined;
  }

  register(svc: Service, opts?: RegisterOption): Service {
    return undefined;
  }

  watch(opts: WatchOption): void {
    // TODO
  }
}
