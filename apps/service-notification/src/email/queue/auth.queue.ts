import {
  Queue,
  QueueProcess,
  OnQueueActive,
  OnQueueEvent,
  BullQueueEvents,
} from 'nest-bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EmailService } from '../email.service';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { EmailVerifiedEvent } from '@graphqlcqrs/core/cqrs';

@Queue({ name: 'auth_queue' })
export class AuthQueue {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly service: EmailService) {}

  @QueueProcess({ name: 'UserRegistered' })
  async processUserRegister(job: Job<UserEntity>) {
    await this.service.sendRegisterEmail(job.data);
  }

  @QueueProcess({ name: 'UserLoggedIn' })
  async processUserLogged(job: Job<UserEntity>) {
    await this.service.sendLoggedInEmail(job.data);
  }

  @QueueProcess({ name: 'EmailVerified' })
  async processEmailVerified(job: Job<UserEntity>) {
    await this.service.sendWelcomeEmail(job.data);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  async onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`,
    );
    await job.remove();
  }
}
