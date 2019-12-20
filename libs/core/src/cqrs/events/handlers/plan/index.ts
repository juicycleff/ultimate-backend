import { PlanCreatedHandler } from './plan-created.handler';
import { PlanDeletedHandler } from './plan-deleted.handler';
import { PlanUpdatedHandler } from './plan-updated.handler';

export const PlanEventHandlers = [
  PlanCreatedHandler,
  PlanDeletedHandler,
  PlanUpdatedHandler,
];
