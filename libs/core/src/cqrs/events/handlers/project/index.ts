import { ProjectCreatedHandler } from './project-created.handler';
import { ProjectDeletedHandler } from './project-deleted.handler';
import { ProjectUpdatedHandler } from './project-updated.handler';

export const ProjectEventHandlers = [
  ProjectCreatedHandler,
  ProjectDeletedHandler,
  ProjectUpdatedHandler,
];
