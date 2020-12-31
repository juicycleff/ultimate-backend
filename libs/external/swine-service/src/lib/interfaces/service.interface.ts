/**
 * @description Actual swine service interface
 */
export class Service {
  /**
   * Service name
   */
  name: string;

  /**
   * Service endpoints
   */
  endpoints?: Array<Endpoint>;

  /**
   * Service name
   */
  nodes?: Array<ServiceNode>;

  /**
   * Service version
   */
  version?: string;

  /**
   * Some meta data
   */
  metadata?: Map<string, string>;

  /**
   * Tags for grouping and identifying services
   */
  tags?: string[];

  /**
   * Service zone (Geo location)
   */
  zone?: string;

  /**
   * Service zonal region (Geo location)
   */
  region?: string;

  /**
   * Status of the service
   */
  status?: string;
}

/**
 * @description service endpoint
 */
export class Endpoint {
  name: string;
  request?: Value;
  response?: Value;
  metadata: Map<string, string>;
}

/**
 * @description service value
 */
export class Value {

  name: string;

  type?: string;

  values: Array<Value>;
}

/**
 * @description service node
 */
export class ServiceNode {
  id: string;
  address: string;
  metadata: Map<string, string>;
}
