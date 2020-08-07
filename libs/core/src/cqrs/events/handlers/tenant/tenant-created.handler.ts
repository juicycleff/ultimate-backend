import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TenantCreatedEvent } from '../../impl';

@EventsHandler(TenantCreatedEvent)
export class TenantCreatedHandler implements IEventHandler<TenantCreatedEvent> {
  handle(event: TenantCreatedEvent): any {
    Logger.log(event, 'TenantCreatedEvent');
  }
}
