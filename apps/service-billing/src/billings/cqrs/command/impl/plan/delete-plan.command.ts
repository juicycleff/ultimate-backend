import { ICommand } from '@nestjs/cqrs';

export class DeletePlanCommand implements ICommand {
  constructor(public readonly input: any) {}
}
