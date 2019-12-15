import { PlanCreatedHandler } from './plan-created.handler';
import { PlanDeletedHandler } from './plan-deleted.handler';
import { PlanUpdatedHandler } from './plan-updated.handler';

export const PlanHandlers = [
  PlanCreatedHandler,
  PlanDeletedHandler,
  PlanUpdatedHandler,
];
