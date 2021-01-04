export interface ServiceInstance {
  /**
   * @returns The unique instance ID as registered.
   */
  getInstanceId(): string;

  /**
   * @returns the service ID as registered
   */
  getServiceId(): string;

  /**
   * @returns hostname of the registered service
   */
  getHost(): string;

  /**
   * @returns port of the registered service
   */
  getPort(): number;

  /**
   * @returns whether the registered service is secure
   */
  isSecure(): boolean;

  /**
   * @returns service universal resource indifier
   */
  getUri(): string;

  /**
   * @returns the scheme of the service.
   */
  getScheme(): string;

  /**
   * @returns the key / value pair associated with the service id.
   */
  getMetadata(): Map<string, string>;
}
