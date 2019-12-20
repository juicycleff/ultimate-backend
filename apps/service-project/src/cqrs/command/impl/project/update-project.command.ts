import { ICommand } from '@nestjs/cqrs';
import { UpdateProjectInput } from '../../../../types';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly input: UpdateProjectInput,
  ) {}
}
