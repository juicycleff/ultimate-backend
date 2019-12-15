import { ICommand } from '@nestjs/cqrs';
import { CreateUpdatePlanInput } from '../../../../types';
import { ObjectID } from 'bson';

export class UpdatePlanCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly input: CreateUpdatePlanInput,
  ) {}
}
