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
 * File name:         service-instance.ts
 * Last modified:     10/01/2021, 19:15
 ******************************************************************************/
import { PlainObject } from '../utils';
import { ServiceInstanceState } from '../health';

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
  getMetadata(): PlainObject;

  /**
   * @returns the key / value pair associated with the service id.
   */
  getTags(): string[];

  /**
   * @returns returns service instance heakth status.
   */
  getStatus(): string;

  /**
   * @returns service instance cluster node ID
   */
  getNodeID(): string;

  /**
   * @returns service instance state
   */
  getState(): ServiceInstanceState;
}
