import { Logger } from '@nestjs/common';
import { HeartbeatOptions } from '../';
import { HeartbeatTask } from '../interfaces';

const tasks = new Map<string, any>();

export class TtlScheduler {
  logger = new Logger(TtlScheduler.name);

  constructor(
    private heartbeatOptions: HeartbeatOptions,
    private task: HeartbeatTask
  ) {}

  /**
   * add a service to the checks loop
   *
   * @param instanceId instance id
   */
  add(instanceId: string): void {
    const taskId = setInterval(() => {
      this.task.run();
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
