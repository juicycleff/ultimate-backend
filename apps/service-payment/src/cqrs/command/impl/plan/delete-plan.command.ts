import { ICommand } from '@nestjs/cqrs';
import { DeletePlanInput } from '../../../../types';

export class DeletePlanCommand implements ICommand {
  constructor(
    public readonly input: DeletePlanInput,
  ) {}
}
