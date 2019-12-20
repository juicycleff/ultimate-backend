import { ICommand } from '@nestjs/cqrs';
import { DeleteProjectInput } from '../../../../types';

export class DeleteProjectCommand implements ICommand {
  constructor(
    public readonly input: DeleteProjectInput,
  ) {}
}
