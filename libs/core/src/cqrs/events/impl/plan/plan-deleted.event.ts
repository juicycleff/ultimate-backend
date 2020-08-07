import { IEvent } from '@nestjs/cqrs';
import { PlanEntity } from '@ultimatebackend/repository';

export class PlanDeletedEvent implements IEvent {
  constructor(public readonly plan: PlanEntity) {}
}
