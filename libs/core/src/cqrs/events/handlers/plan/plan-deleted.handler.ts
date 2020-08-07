import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PlanDeletedEvent } from '../../impl';

@EventsHandler(PlanDeletedEvent)
export class PlanDeletedHandler implements IEventHandler<PlanDeletedEvent> {
  handle(event: PlanDeletedEvent): any {
    Logger.log(event, 'PlanDeletedEvent'); // write here
  }
}
