import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlanCreatedEvent } from '../../impl';

@EventsHandler(PlanCreatedEvent)
export class PlanCreatedHandler implements IEventHandler<PlanCreatedEvent> {
  handle(event: PlanCreatedEvent): any {
    Logger.log(event, 'PlanCreatedEvent'); // write here
  }
}
