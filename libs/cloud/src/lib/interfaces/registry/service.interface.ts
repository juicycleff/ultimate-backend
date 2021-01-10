import { ServiceInstance } from './service-instance';

export type Registration = ServiceInstance;

/**
 *  Contract to register and deregister instances with a Service Registry.
 *
 * @author Rex Isaac Raphael
 */
export interface ServiceRegistration<R extends Registration> {
  /**
   * Registers a registration. A registration contains information about an instance, such as host and port.
   *
   * @param registration registration metadata
   */
  register(registration: R): Promise<void>;

  /**
   * Deregister a registration.
   *
   * @param registration registration metadata
   */
  deregister(registration: R): Promise<void>;

  /**
   * Close the registration.
   */
  close(): void;

  /**
   *  Sets the status of the registration. The status values are determined by the
   * individual implementations.
   *
   * @param registration registration metadata
   * @param status the status code.
   */
  setStatus(registration: R, status: string): Promise<void>;

  /**
   *
   * @param registration registration metadata
   * @returns
   */
  getStatus<T>(registration: R): Promise<T>;
}
