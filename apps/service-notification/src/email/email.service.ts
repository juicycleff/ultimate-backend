import { Injectable, Logger } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { UserEntity } from '@graphqlcqrs/repository/entities';
import { ConfigService } from '@graphqlcqrs/common/services/config.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendGrid: SendGridService,
    private readonly configService: ConfigService,
  ) {}

  public async sendLoggedInEmail(user: UserEntity) {
    const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);

    try {
      await this.sendGrid.send({
        to: userEmail.address,
        from: 'noreply@demo.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'You just logged into this device', // plaintext body
      });
    } catch (e) {
      Logger.error(e.message, e);
    }
  }

  public async sendRegisterEmail(user: UserEntity) {
    const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);

    try {
      await this.sendGrid.send({
        to: userEmail.address,
        from: 'noreply@demo.com',
        subject: 'Thank for registering',
        text: `Here is your verification code ${userEmail.verificationCode}`, // plaintext body
      });
    } catch (e) {
      Logger.error(e.message, e);
    }
  }

  public async sendWelcomeEmail(user: UserEntity) {
    const userEmail = user.emails.reduce(previousValue => previousValue.primary === true && previousValue);

    try {
      await this.sendGrid.send({
        to: userEmail.address,
        from: 'noreply@demo.com',
        subject: 'Hurray! Welcome',
        text: `Your account has been verified successfully, you can now log in.`, // plaintext body
      });
    } catch (e) {
      Logger.error(e.message, e);
    }
  }
}
