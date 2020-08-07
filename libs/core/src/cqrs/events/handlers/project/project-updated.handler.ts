import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectUpdatedEvent } from '../../';

@EventsHandler(ProjectUpdatedEvent)
export class ProjectUpdatedHandler
  implements IEventHandler<ProjectUpdatedEvent> {
  handle(event: ProjectUpdatedEvent): any {
    Logger.log(event, 'ProjectUpdatedEvent'); // write here
  }
}
