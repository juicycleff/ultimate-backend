import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TenantRemovedEvent } from '../../impl';

@EventsHandler(TenantRemovedEvent)
export class TenantRemovedHandler implements IEventHandler<TenantRemovedEvent> {
  handle(event: TenantRemovedEvent): any {
    Logger.log(event, 'TenantRemovedEvent');
  }
}
