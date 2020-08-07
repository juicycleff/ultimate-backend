import { Injectable, Logger } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { MailData } from '@sendgrid/helpers/classes/mail';

@Injectable()
export class EmailService {
  constructor(private readonly sendGrid: SendGridService) {}

  public async sendEmail(
    data: Partial<MailData> | Array<Partial<MailData>>,
    isMultiple?: boolean,
  ) {
    if (!data) {
      return null;
    }

    try {
      await this.sendGrid.send({ ...data }, isMultiple);
    } catch (e) {
      Logger.error(e.message, e);
    }
  }
}
