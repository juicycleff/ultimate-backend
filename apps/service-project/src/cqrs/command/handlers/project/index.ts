import { CreateProjectHandler } from './create-project.handler';
import { DeleteProjectHandler } from './delete-project.handler';
import { UpdateProjectHandler } from './update-project.handler';

export const ProjectCommandHandlers = [
  CreateProjectHandler,
  DeleteProjectHandler,
  UpdateProjectHandler,
];
