import { Logger } from '@nestjs/common';
import { ConsulClient } from '../../';
import { HeartbeatTask } from '@ultimate-backend/common';

export class ConsulHeartbeatTask implements HeartbeatTask {
  logger = new Logger(ConsulHeartbeatTask.name);
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
