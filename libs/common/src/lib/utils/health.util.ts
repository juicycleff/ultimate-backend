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
 * File name:         health.util.ts
 * Last modified:     21/03/2021, 14:39
 * Source:            https://github.com/moleculerjs/moleculer/blob/0d50351fd2e5fe592b79f351f69bf695b428d0c5/src/utils.js#L142
 ******************************************************************************/

import * as os from 'os';
import { getIpList } from '@ultimate-backend/common';

const UB_VERSION = require('../package.json').version;

const getClientInfo = () => {
  return {
    type: 'nodejs',
    version: UB_VERSION,
    langVersion: process.version,
  };
};

const getCpuInfo = () => {
  const cpus = os.cpus();
  const load = os.loadavg();
  const cpu = {
    load1: load[0],
    load5: load[1],
    load15: load[2],
    cores: Array.isArray(cpus) ? os.cpus().length : null,
    utilization: undefined,
  };
  cpu.utilization = Math.min(Math.floor((load[0] * 100) / cpu.cores), 100);

  return cpu;
};

const getMemoryInfo = () => {
  const mem = {
    free: os.freemem(),
    total: os.totalmem(),
    percent: undefined,
  };
  mem.percent = (mem.free * 100) / mem.total;

  return mem;
};

const getUserInfo = () => {
  try {
    return os.userInfo();
  } catch (e) {
    return {};
  }
};

const getOsInfo = () => {
  return {
    uptime: os.uptime(),
    type: os.type(),
    release: os.release(),
    hostname: os.hostname(),
    arch: os.arch(),
    platform: os.platform(),
    user: getUserInfo(),
  };
};
const getProcessInfo = () => {
  return {
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    argv: process.argv,
  };
};

const getNetworkInterfacesInfo = () => {
  return {
    ip: getIpList(),
  };
};

const getDateTimeInfo = () => {
  return {
    now: Date.now(),
    iso: new Date().toISOString(),
    utc: new Date().toUTCString(),
  };
};

const getHealthStatus = (/*broker*/) => {
  return {
    cpu: getCpuInfo(),
    mem: getMemoryInfo(),
    os: getOsInfo(),
    process: getProcessInfo(),
    net: getNetworkInterfacesInfo(),
    time: getDateTimeInfo(),
  };
};

export const healthUtils = {
  getHealthStatus,
  getCpuInfo,
  getMemoryInfo,
  getOsInfo,
  getProcessInfo,
  getClientInfo,
  getNetworkInterfacesInfo,
  getDateTimeInfo,
};
