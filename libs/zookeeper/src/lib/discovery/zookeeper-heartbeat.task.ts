import { Logger } from '@nestjs/common';
import { ZookeeperClient } from '../../';
import { HeartbeatTask } from '@ultimate-backend/common';

export class ZookeeperHeartbeatTask implements HeartbeatTask {
  logger = new Logger(ZookeeperHeartbeatTask.name);
  private readonly checkId: string;

  constructor(private client: ZookeeperClient, serviceId: string) {
    this.checkId = serviceId;
    if (!this.checkId.startsWith('service:')) {
      this.checkId = `service:${this.checkId}`;
    }
  }

  run() {
    try {
      (async () => {
        // this.client.namespace('ub-service-registry').agent.check.pass(this.checkId);
      })();
      this.logger.log(`Sending zookeeper heartbeat for: ${this.checkId}`);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
