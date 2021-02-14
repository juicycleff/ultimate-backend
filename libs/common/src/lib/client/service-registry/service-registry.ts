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
 * File name:         service-registry.ts
 * Last modified:     09/02/2021, 18:22
 ******************************************************************************/

import { Registration } from './registration';

/**
 * Contract to register and deregister instances with a Service Registry.
 *
 * @author Rex Isaac Raphael
 */
export interface ServiceRegistry<R extends Registration> {
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
