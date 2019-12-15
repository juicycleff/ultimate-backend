import { IEvent } from '@nestjs/cqrs';
import { PlanEntity } from '@graphqlcqrs/repository';

export class PlanDeletedEvent implements IEvent {
  constructor(
    public readonly plan: PlanEntity) {}
}
