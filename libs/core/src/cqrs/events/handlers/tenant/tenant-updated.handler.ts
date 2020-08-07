import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TenantUpdatedEvent } from '../../impl';

@EventsHandler(TenantUpdatedEvent)
export class TenantUpdatedHandler implements IEventHandler<TenantUpdatedEvent> {
  handle(event: TenantUpdatedEvent): any {
    Logger.log(event, 'TenantUpdatedEvent');
  }
}
