import { Service } from './service.interface';
import {
  DeregisterOption,
  GetOption,
  ListOption,
  RegistryOption,
  RegisterOption,
  WatchOption,
} from './registry-options.interface';

export type ServiceList = { [service: string]: Array<Service> };

export interface IRegistry {
  /**
   * Watch for events from service
   */
  watch(opts: WatchOption): void;

  /**
   * initialize setup
   */
  init(opts: RegistryOption): void;

  /**
   * Registers a service to the service registry
   */
  register(svc: Service, opts?: RegisterOption): Service;

  /**
   * De-registers a service to the service registry
   */
  deregister(svc: Service, opts?: DeregisterOption): Service;

  /**
   * Returns a service by name
   * @param name
   * @param opts
   * @returns {Array<Service>}
   */
  getService(name: string, opts?: GetOption): Array<Service>;

  /**
   * Returns an object of all registered services
   */
  listServices(opts?: ListOption): ServiceList;
}
