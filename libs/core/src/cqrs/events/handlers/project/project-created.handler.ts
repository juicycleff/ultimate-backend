import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from '../../';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedHandler
  implements IEventHandler<ProjectCreatedEvent> {
  handle(event: ProjectCreatedEvent): any {
    Logger.log(event, 'ProjectCreatedEvent'); // write here
  }
}
