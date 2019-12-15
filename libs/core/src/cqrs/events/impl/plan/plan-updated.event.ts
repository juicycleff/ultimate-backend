import { IEvent } from '@nestjs/cqrs';
import { PlanEntity } from '@graphqlcqrs/repository';

export class PlanUpdatedEvent implements IEvent {
  constructor(
    public readonly plan: PlanEntity) {}
}
