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
 * File name:         service-instance.options.ts
 * Last modified:     12/03/2021, 16:14
 ******************************************************************************/

/**
 * Service instance options
 */
export interface ServiceInstanceOptions {
  /**
   * instanceId the id of the instance.
   */
  instanceId: string,

  /**
   * Node the id of the instance.
   */
  nodeID?: string,

  /**
   * serviceId the id of the service.
   */
  serviceId: string,

  /**
   * host where the service instance can be found.
   */
  host: string,

  /**
   * service instance status.
   */
  status?: string,

  /**
   * service tags.
   */
  tags?: string[],

  /**
   * port the port on which the service is running.
   */
  port: number,

  /**
   * secure indicates whether or not the connection needs to be secure.
   */
  secure: boolean,

  /**
   * metadata optional a map containing metadata.
   */
  metadata?: { [name: string]: string}
}
