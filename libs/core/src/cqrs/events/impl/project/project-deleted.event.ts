import { IEvent } from '@nestjs/cqrs';
import { ProjectEntity } from '@ultimatebackend/repository';

export class ProjectDeletedEvent implements IEvent {
  constructor(public readonly project: ProjectEntity) {}
}
