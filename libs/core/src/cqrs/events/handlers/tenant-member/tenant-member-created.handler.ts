import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import { TenantMemberCreatedEvent } from '../../impl';

@EventsHandler(TenantMemberCreatedEvent)
export class TenantMemberCreatedHandler implements IEventHandler<TenantMemberCreatedEvent> {
  handle(event: TenantMemberCreatedEvent): any {
    Logger.log(event, 'TenantMemberCreatedEvent');
  }
}
