import { Logger } from '@nestjs/common';
import { EtcdClient } from '../etcd.client';
import { HeartbeatTask } from '@ultimate-backend/common';

export class EtcdHeartbeatTask implements HeartbeatTask {
  logger = new Logger(EtcdHeartbeatTask.name);
  private readonly checkId: string;

  constructor(private client: EtcdClient, serviceId: string) {
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
      this.logger.log(`Sending etcd heartbeat for: ${this.checkId}`);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
