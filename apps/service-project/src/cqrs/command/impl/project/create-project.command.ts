import { ICommand } from '@nestjs/cqrs';
import { CreateProjectInput } from '../../../../types';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly input: CreateProjectInput,
  ) {}
}
