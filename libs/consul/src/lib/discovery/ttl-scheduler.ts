import { Logger } from '@nestjs/common';
import { ConsulService } from '../../';
import { HeartbeatOptions } from './heartbeat.interface';

const tasks = new Map<string, any>();

class ConsulHeartbeatTask {
  logger = new Logger('ConsulHeartbeatTask');
  private readonly checkId: string;

  constructor(private client: ConsulService, serviceId: string) {
    this.checkId = serviceId;
    if (!this.checkId.startsWith('service:')) {
      this.checkId = `service:${this.checkId}`;
    }
  }

  run() {
    (async () => {
      this.client.consul.agent.check.pass(this.checkId);
    })();
    this.logger.log(`Sending consul heartbeat for: ${this.checkId}`);
  }
}

export class TtlScheduler {
  logger = new Logger('TtlScheduler');

  constructor(
    private heartbeatOptions: HeartbeatOptions,
    private client: ConsulService
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
    const interval = this.heartbeatOptions.ttlInSeconds * intervalRatio;
    const max = Math.max(interval, 1);
    const ttlMinus1 = this.heartbeatOptions.ttlInSeconds - 1;
    const min = Math.min(ttlMinus1, max);
    const heartbeatInterval = Math.round(1000 * min);
    this.logger.log(`computed heartbeat interval ${heartbeatInterval}`);

    return heartbeatInterval;
  }
}
