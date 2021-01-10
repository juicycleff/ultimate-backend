import * as Consul from 'consul';
import { HeartbeatOptions } from '../../interfaces';
import { Logger } from '@nestjs/common';

const tasks = new Map<string, any>();

class ConsulHeartbeatTask {
  logger = new Logger('ConsulHeartbeatTask');
  private readonly checkId: string;

  constructor(private consulClient: Consul.Consul, serviceId: string) {
    this.checkId = serviceId;
    if (!this.checkId.startsWith('service:')) {
      this.checkId = `service:${this.checkId}`;
    }
  }

  run() {
    (async () => {
      this.consulClient.agent.check.pass(this.checkId);
    })();
    this.logger.log(`Sending consul heartbeat for: ${this.checkId}`);
  }
}

export class TtlScheduler {
  logger = new Logger('TtlScheduler');

  constructor(private heartbeatOptions: HeartbeatOptions, private consulClient: Consul.Consul) {
  }

  /**
   * add a service to the checks loop
   *
   * @param instanceId instance id
   */
  add(instanceId: string): void {
    const task = new ConsulHeartbeatTask(this.consulClient, instanceId);
    const taskId = setInterval(() => {
      task.run();
    }, this.computeHeartbeatInterval());
    const previousTaskId = tasks.get(instanceId);
    if (previousTaskId) {
      clearInterval(previousTaskId);
    }

    tasks.set(instanceId, taskId);
  }

  remove(instanceId: string): void {
    const taskId = tasks.get(instanceId);
    if (taskId) {
      clearInterval(taskId);
    }
    tasks.delete(instanceId);
  }

  private computeHeartbeatInterval(): number {
    const intervalRatio = 2.0 / 3.0;
    const interval = this.heartbeatOptions.ttlInSeconds * intervalRatio;
    const max = Math.max(interval, 1);
    const ttlMinus1 = this.heartbeatOptions.ttlInSeconds - 1;
    const min = Math.min(ttlMinus1, max);
    const heartbeatInterval = Math.round(1000 * min);
    this.logger.log(`computed heartbeat interval ${heartbeatInterval}`);

    return heartbeatInterval;
  }
}
