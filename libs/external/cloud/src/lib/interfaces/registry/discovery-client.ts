import { ServiceInstance } from './service-instance';

/**
 * Represents read operations commonly available to discovery services such as consul.io
 *
 * @author Rex Isaac Raphael
 */
export interface DiscoveryClient {
  /**
   * A human readable name to the implementation
   * @returns description of the client
   */
  description(): string;

  /**
   * Get's all serviceInstance associated with the service id
   * @param serviceId name of the service to query
   * @returns list of ServiceInstance
   */
  getInstances(serviceId: string): Promise<ServiceInstance[]>;

  /**
   * @returns all serviceInstances
   */
  getAllInstances(): Promise<ServiceInstance[]>;

  /**
   * @returns all known services id
   */
  getServices(): Promise<string[]>;
}
