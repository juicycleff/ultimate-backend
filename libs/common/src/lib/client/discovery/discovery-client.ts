/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         discovery-client.ts
 * Last modified:     09/02/2021, 18:31
 ******************************************************************************/

/**
 * Represents read operations commonly available to discovery services such as consul.io
 *
 * @author Rex Isaac Raphael
 */
import { ServiceInstance } from '../service-instance';

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
