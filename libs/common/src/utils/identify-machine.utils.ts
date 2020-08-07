// import { Address6 } from 'ip-address';
// import { AuthenticationError } from 'apollo-server-express';
import { IRequest } from '../interfaces';
import { Logger } from '@nestjs/common';
// import * as useragent from 'express-useragent';

export class IdentifyMachineUtils {
  // tslint:disable-next-line:no-empty
  constructor(readonly req: IRequest) {}

  sender() {
    const ip =
      this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress;
    Logger.log(ip, this.constructor.name);
    // const address = new Address6(ip);

    return {
      ip: 'free',
      userAgent: 'free',
    };

    /*
    if (!address.isValid()) { throw new AuthenticationError('Your are not a valid machine'); }

    const teredo = address.inspectTeredo();
    const source = this.req.headers['user-agent'];
    const userAgent = source ? useragent.parse(source) : {};

    return {
      ip: teredo.client4,
      userAgent,
    }; */
  }
}
