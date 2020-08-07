import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectDeletedEvent } from '../../';

@EventsHandler(ProjectDeletedEvent)
export class ProjectDeletedHandler
  implements IEventHandler<ProjectDeletedEvent> {
  handle(event: ProjectDeletedEvent): any {
    Logger.log(event, 'ProjectDeletedEvent'); // write here
  }
}
