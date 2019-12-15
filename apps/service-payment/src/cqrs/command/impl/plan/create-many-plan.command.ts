import { ICommand } from '@nestjs/cqrs';
import { CreateUpdatePlanInput } from '../../../../types';

export class CreateManyPlanCommand implements ICommand {
  constructor(
    public readonly inputs: [CreateUpdatePlanInput],
  ) {}
}
