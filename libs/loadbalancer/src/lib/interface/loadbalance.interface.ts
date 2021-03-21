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
 * File name:         load-balancer.interface.ts
 * Last modified:     06/03/2021, 18:51
 ******************************************************************************/
import { ServiceInstance } from '@ultimate-backend/common';
import { LoadBalancerRequest } from '../core';

export interface ILoadBalancerClient {
  /**
   * Executes request using a ServiceInstance from the LoadBalancer for the specified
   * service.
   * @param serviceId The service ID to look up the LoadBalancer.
   * @param request Allows implementations to execute pre and post actions, such as
   * incrementing metrics.
   * @return The result of the LoadBalancerRequest callback on the selected
   * ServiceInstance.
   */
  execute<T>(serviceId: string, request: LoadBalancerRequest<T>): T;

  /**
   * Executes request using a ServiceInstance from the LoadBalancer for the specified
   * service.
   * @param serviceId The service ID to look up the LoadBalancer.
   * @param node
   * @param request Allows implementations to execute pre and post actions, such as
   * incrementing metrics.
   * @return The result of the LoadBalancerRequest callback on the selected
   * ServiceInstance.
   */
  execute<T>(
    serviceId: string,
    node: ServiceInstance,
    request: LoadBalancerRequest<T>
  ): T;
}
