import { IEvent } from '@nestjs/cqrs';
import { ProjectEntity } from '@graphqlcqrs/repository';

export class ProjectUpdatedEvent implements IEvent {
  constructor(public readonly project: ProjectEntity) {}
}
