import { IEvent } from '@nestjs/cqrs';
import { PlanEntity } from '@ultimatebackend/repository';

export class PlanUpdatedEvent implements IEvent {
  constructor(public readonly plan: PlanEntity) {}
}
