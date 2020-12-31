import {
  ExecutionContext,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit

} from '@nestjs/common';

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
  Watcher,
} from '../../interfaces';
import { MemoryRecord, Services } from './types.interface';
import { DefaultDomain } from '../event-type';
import { getServiceRecords } from './helper';

// records is a KV map with domain name as the key and a services map as the value
const services = new Map<string, Map<string, MemoryRecord>>();

@Injectable()
export class MemoryRegistry
  implements IRegistry, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MemoryRegistry.name);

  records: Map<string, Services>;
  watchers: Map<string, Watcher>;
  options: RegistryOption;

  constructor(private context: ExecutionContext) {}

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

  async init(opts: RegistryOption): Promise<void> {
    let srvs;

    if (this.records) {
      srvs = this.records[DefaultDomain];
    } else {
      srvs = services;
    }

    for (const name in getServiceRecords()) {
      if (srvs[name]) {
        // TODO
      }
      const rec = srvs[name]
    }

    // set the services in the registry
    this.records[DefaultDomain] = srvs
  }

  listServices(opts?: ListOption): ServiceList {
    return undefined;
  }

  register(svc: Service, opts?: RegisterOption): Service {
    return undefined;
  }

  watch(opts: WatchOption): void {
    //TODO
  }
}
