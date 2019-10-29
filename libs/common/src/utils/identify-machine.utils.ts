import { Address6 } from 'ip-address';
import { AuthenticationError } from 'apollo-server-express';
import { IRequest } from '@graphqlcqrs/core/interfaces';
import * as useragent from 'express-useragent';

export class IdentifyMachineUtils {
  // tslint:disable-next-line:no-empty
  constructor(readonly req: IRequest) {}

  sender() {
    const ip = this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress;
    const address = new Address6(ip);

    if (!address.isValid()) { throw new AuthenticationError('Your are not a valid machine'); }

    const teredo = address.inspectTeredo();
    const source = this.req.headers['user-agent'];
    const userAgent = source ? useragent.parse(source) : {};

    return {
      ip: teredo.client4,
      userAgent,
    };
  }
}
