import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueEvent,
  BullQueueEvents,
} from 'nest-bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EmailService } from '../email.service';
import { UserEntity } from '@graphqlcqrs/repository/entities';
// import { ConfigService } from '@graphqlcqrs/common/services/config.service';

@Processor({ name: 'auth_queue' })
export class AuthQueue {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly service: EmailService,
    // private readonly configService: ConfigService,
  ) {}

  @Process({ name: 'UserRegistered' })
  async processUserRegister(job: Job<UserEntity>) {
    if (job.data) { return; }

    const user = job.data;
    const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);

    await this.service.sendEmail({
      to: userEmail.address,
      from: 'noreply@demo.com',
      subject: 'Thank for registering',
      text: `Here is your verification code ${userEmail.verificationCode}`, // plaintext body
    });
  }

  @Process({ name: 'UserLoggedIn' })
  async processUserLogged(job: Job<UserEntity>) {
    if (job.data) { return; }

    const user = job.data;
    const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);

    await this.service.sendEmail({
      to: userEmail.address,
      from: 'noreply@demo.com',
      subject: 'User Logged In',
      text: 'You just logged into this device',
    });
  }

  @Process({ name: 'EmailVerified' })
  async processEmailVerified(job: Job<UserEntity>) {
    if (job.data) { return; }

    const user = job.data;
    const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);

    await this.service.sendEmail({
      to: userEmail.address,
      from: 'noreply@demo.com',
      subject: 'Hurray! Welcome',
      text: `Your account has been verified successfully, you can now log in.`, // plaintext body
    });
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
