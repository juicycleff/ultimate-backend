import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import { TenantMemberInvitedEvent } from '../../impl';

@EventsHandler(TenantMemberInvitedEvent)
export class TenantMemberInvitedHandler implements IEventHandler<TenantMemberInvitedEvent> {
  handle(event: TenantMemberInvitedEvent): any {
    Logger.log(event, 'TenantMemberInvitedEvent');
  }
}
