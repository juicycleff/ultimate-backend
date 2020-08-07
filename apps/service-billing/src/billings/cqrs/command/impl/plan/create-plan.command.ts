import { ICommand } from '@nestjs/cqrs';
import { CreatePlanRequest } from '@ultimatebackend/proto-schema/billing';

export class CreatePlanCommand implements ICommand {
  constructor(public readonly input: CreatePlanRequest) {}
}
