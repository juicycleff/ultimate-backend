import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {ValidatorOptions} from '@nestjs/common/interfaces/external/validator-options.interface';

export class ValidationError extends HttpException {
  public messages: string[];

  constructor(messages: string[], public metaData?: { target?: any; options: ValidatorOptions; data: any }) {
    super(messages && messages.length > 0 ? messages[0] : 'Validation Error', HttpStatus.BAD_REQUEST);
    this.messages = messages;
    // tslint:disable-next-line:no-console
    Logger.log(JSON.stringify(metaData, null, 2));
  }
}
