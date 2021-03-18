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
 * File name:         health-check.ts
 * Last modified:     09/03/2021, 23:28
 ******************************************************************************/

export class HealthCheck {
  /**
   * Initial delay value for the HealthCheck scheduler.
   */
  initialDelay = 0;

  /**
   * Interval for rerunning the HealthCheck scheduler.
   */
  interval = 25000;

  /**
   * Interval for refetching available service instances.
   */
  refetchInstancesInterval = 25000;

  path: Map<String, String> = new Map();

  /**
   * Indicates whether the instances should be refetched by the
   * <code>HealthCheckServiceInstanceListSupplier</code>. This can be used if the
   * instances can be updated and the underlying delegate does not provide an
   * ongoing flux.
   */
  refetchInstances = false;

  /**
   * Indicates whether health checks should keep repeating. It might be useful to
   * set it to <code>false</code> if periodically refetching the instances, as every
   * refetch will also trigger a healthcheck.
   */
  repeatHealthCheck = true;
}
