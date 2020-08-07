import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlanUpdatedEvent } from '../../impl';

@EventsHandler(PlanUpdatedEvent)
export class PlanUpdatedHandler implements IEventHandler<PlanUpdatedEvent> {
  handle(event: PlanUpdatedEvent): any {
    Logger.log(event, 'PlanUpdatedEvent'); // write here
  }
}
