import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { TenantMemberEmbed, UserEntity } from '@ultimatebackend/repository';
import { EmailService } from '../email.service';
import { SkeletonsEncrypt } from '@ultimatebackend/common/utils';
import {
  DASHBOARD_APP_LINK,
  QUEUE_PROCESS_IDS,
  SENDGRID_TEMPLATE_IDS,
} from '../email.constants';
import {
  SendGridActivation,
  SendGridInvitation,
  SendGridResetPassword,
  SendGridWelcome,
} from '../interfaces';

@Processor('notification_queue')
export class AuthProcess {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly service: EmailService) {}

  @Process(QUEUE_PROCESS_IDS.UserRegistered)
  async processUserRegister(
    job: Job<UserEntity & { activationLink?: string }>,
  ) {
    if (!job.data) {
      return;
    }

    const user = job.data;
    const userEmail = user.emails.reduce(
      (previousValue) => previousValue.primary === true && previousValue,
    );

    const dynamicTemplateData: SendGridActivation = {
      name: `${user.firstname} ${user.lastname}`,
      code: userEmail.verificationCode,
      link: `${DASHBOARD_APP_LINK}/verify-email?token=${user.activationLink}`,
    };

    await this.service.sendEmail({
      to: userEmail.address,
      templateId: SENDGRID_TEMPLATE_IDS.activation,
      dynamicTemplateData,
    });
  }

  @Process(QUEUE_PROCESS_IDS.SendVerificationCode)
  async sendVerificationCode(
    job: Job<UserEntity & { activationLink?: string }>,
  ) {
    if (job.data === null) {
      return;
    }

    const user = job.data;
    const userEmail = user.emails.reduce(
      (previousValue) => previousValue.primary === true && previousValue,
    );

    const dynamicTemplateData: SendGridActivation = {
      name: `${user.firstname} ${user.lastname}`,
      code: userEmail.verificationCode,
      link: `${DASHBOARD_APP_LINK}/verify-email?token=${user.activationLink}`,
    };

    try {
      await this.service.sendEmail({
        to: userEmail.address,
        templateId: SENDGRID_TEMPLATE_IDS.activation,
        dynamicTemplateData,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Process(QUEUE_PROCESS_IDS.ResetPassword)
  async resetPassword(job: Job<UserEntity & { resetPasswordLink?: string }>) {
    if (job.data === null) {
      return;
    }

    const user = job.data;
    const userEmail = user.emails.reduce(
      (previousValue) => previousValue.primary === true && previousValue,
    );

    const dynamicTemplateData: SendGridResetPassword = {
      reset_link: `${DASHBOARD_APP_LINK}/confirm-password-reset?token=${user.resetPasswordLink}`,
    };

    try {
      await this.service.sendEmail({
        to: userEmail.address,
        templateId: SENDGRID_TEMPLATE_IDS.resetPassword,
        dynamicTemplateData,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Process(QUEUE_PROCESS_IDS.UserLoggedIn)
  async processUserLogged(job: Job<UserEntity>) {
    if (!job.data) {
      return;
    }

    const user = job.data;
    const userEmail = user.emails.reduce(
      (previousValue) => previousValue.primary === true && previousValue,
    );

    await this.service.sendEmail({
      to: userEmail.address,
      subject: 'User Logged In',
      text: 'You just logged into this device',
    });
  }

  @Process(QUEUE_PROCESS_IDS.EmailVerified)
  async processEmailVerified(job: Job<UserEntity>) {
    if (!job.data) {
      return;
    }

    const user = job.data;
    const userEmail = user.emails.reduce(
      (previousValue) => previousValue.primary === true && previousValue,
    );

    const dynamicTemplateData: SendGridWelcome = {
      first_name: `${user.firstname}`,
      getstarted_link: `${DASHBOARD_APP_LINK}/dashboard`,
      product_name: 'Ultimate Backend',
    };

    await this.service.sendEmail({
      to: userEmail.address,
      templateId: SENDGRID_TEMPLATE_IDS.welcome,
      dynamicTemplateData,
    });
  }

  @Process(QUEUE_PROCESS_IDS.Invitation)
  async processInviteMember(job: Job<TenantMemberEmbed & { token?: string }>) {
    if (!job.data) {
      return;
    }

    const member = job.data;

    const dynamicTemplateData: SendGridInvitation = {
      first_name: '',
      tenant_name: '',
      inviter_name: `${member.invitedBy.name}`,
      invitation_link: `${DASHBOARD_APP_LINK}/verify-email?token=${member.token}`,
    };

    await this.service.sendEmail({
      to: member.email,
      templateId: SENDGRID_TEMPLATE_IDS.welcome,
      dynamicTemplateData,
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`,
    );
    await job.remove();
  }
}
