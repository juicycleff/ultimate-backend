import { ICommand } from '@nestjs/cqrs';
import { CreateUpdatePlanInput } from '../../../../types';

export class CreatePlanCommand implements ICommand {
  constructor(
    public readonly input: CreateUpdatePlanInput,
  ) {}
}
