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
 * File name:         service-instance.state.ts
 * Last modified:     21/03/2021, 14:09
 ******************************************************************************/
import { ServiceStatus } from '@ultimate-backend/common';

export class ServiceInstanceState {
  status: ServiceStatus = ServiceStatus.CRITICAL;
  totalRequests = 0;
  activeRequestsCount = 0;
  weight = -1;
  responseTimeAvg = 0;
  responseTimeMax = 0;
  activeRequestsCountTimeout = 10;
  lastActiveRequestsCountChangeTimestamp = 0;
  firstConnectionTimestamp = 0;
  lastConnectionFailedTimestamp: number = null;
  lastConnectionFailedMessage = '';
  failureCounts = 0;

  fixedWeight = false;

  ServiceInstanceState(fixedWeight?: boolean) {
    this.fixedWeight = fixedWeight || false;
  }

  getActiveRequestsCount(currentTime?: number) {
    if (!currentTime) {
      currentTime = new Date().getTime();
    }
    const count = this.activeRequestsCount;
    if (count === 0) {
      return 0;
    } else if (
      currentTime - this.lastActiveRequestsCountChangeTimestamp >
        this.activeRequestsCountTimeout * 1000 ||
      count < 0
    ) {
      return (this.activeRequestsCount = 0);
    } else {
      return count;
    }
  }

  get isHealthy() {
    return this.status !== ServiceStatus.CRITICAL;
  }

  incrementFailureCounts() {
    if (!this.failureCounts) {
      this.failureCounts = 0;
    }

    return ++this.failureCounts;
  }

  incrementRequestCounts() {
    if (!this.totalRequests) {
      this.totalRequests = 0;
    }

    return ++this.totalRequests;
  }

  incrementActiveRequests() {
    if (!this.activeRequestsCount) {
      this.activeRequestsCount = 0;
    }

    this.lastActiveRequestsCountChangeTimestamp = new Date().getTime();
    return ++this.activeRequestsCount;
  }

  decrementActiveRequests() {
    if (!this.activeRequestsCount) {
      return (this.activeRequestsCount = 0);
    }

    this.lastActiveRequestsCountChangeTimestamp = new Date().getTime();
    return --this.activeRequestsCount;
  }

  setConnectionFailedTime(message = '') {
    this.lastConnectionFailedTimestamp = new Date().getTime();
    this.lastConnectionFailedMessage = message;
    this.status = ServiceStatus.CRITICAL;
  }

  setFirstConnectionTime() {
    if (!this.firstConnectionTimestamp) {
      this.firstConnectionTimestamp = new Date().getTime();
    }
  }

  setResponseTime(time) {
    if (!this.fixedWeight) {
      this.weight = time - this.responseTimeAvg;
    }
    this.responseTimeAvg =
      (this.responseTimeAvg * (this.totalRequests - 1) + time) /
      this.totalRequests;
    this.responseTimeMax = Math.max(this.responseTimeMax, time);
  }
}
