import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import { TenantMemberRemovedEvent } from '../../impl';

@EventsHandler(TenantMemberRemovedEvent)
export class TenantMemberRemovedHandler implements IEventHandler<TenantMemberRemovedEvent> {
  handle(event: TenantMemberRemovedEvent): any {
    Logger.log(event, 'TenantMemberRemovedEvent');
  }
}
