import { Logger } from '@nestjs/common';
import { ConsulClient } from '../../';
import { HeartbeatOptions } from './heartbeat.interface';

const tasks = new Map<string, any>();

class ConsulHeartbeatTask {
  logger = new Logger('CONSUL: '+ ConsulHeartbeatTask.name);
  private readonly checkId: string;

  constructor(private client: ConsulClient, serviceId: string) {
    this.checkId = serviceId;
    if (!this.checkId.startsWith('service:')) {
      this.checkId = `service:${this.checkId}`;
    }
  }

  run() {
    try {
      (async () => {
        this.client.consul.agent.check.pass(this.checkId);
      })();
      this.logger.log(`Sending consul heartbeat for: ${this.checkId}`);
    } catch (e) {
      this.logger.error(e);
    }
  }
}

export class TtlScheduler {
  logger = new Logger('CONSUL: ' + TtlScheduler.name);

  constructor(
    private heartbeatOptions: HeartbeatOptions,
    private client: ConsulClient
  ) {}

  /**
   * add a service to the checks loop
   *
   * @param instanceId instance id
   */
  add(instanceId: string): void {
    const task = new ConsulHeartbeatTask(this.client, instanceId);
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
    const interval = (this.heartbeatOptions.ttlInSeconds || 60) * intervalRatio;
    const max = Math.max(interval, 1);
    const ttlMinus1 = (this.heartbeatOptions.ttlInSeconds || 60) - 1;
    const min = Math.min(ttlMinus1, max);
    const heartbeatInterval = Math.round(1000 * min);
    this.logger.log(`computed heartbeat interval ${heartbeatInterval}`);

    return heartbeatInterval;
  }
}
