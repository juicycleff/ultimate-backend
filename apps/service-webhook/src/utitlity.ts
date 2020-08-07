import { randomBytes } from 'crypto';
import { WebhookEntity } from '@ultimatebackend/repository';
import { Webhook } from '@ultimatebackend/proto-schema/webhook';

export async function generateUniqueByte() {
  const buffer = await randomBytes(12);
  return buffer.toString('hex');
}

export function mapWebhookEntityToProto(at: WebhookEntity): Webhook {
  return {
    active: at.active,
    // @ts-ignore
    createdAt: at?.createdAt,
    // @ts-ignore
    updatedAt: at?.updatedAt,
    id: at.id.toString(),
    createdBy: at?.createdBy?.toString(),
    name: at?.name,
    // @ts-ignore
    auth: at?.auth,
    tenantId: at.tenantId,
    // @ts-ignore,
    selections: at.selections,
    // @ts-ignore,
    requestType: at.requestType,
    // @ts-ignore,
    action: at.action,
    // @ts-ignore,
    eventType: at.eventType,
    // @ts-ignore,
    eventType: at.filter,
    endpoint: at.endpoint,
  };
}

export function mapWebhookEntityArrToProto(ats: WebhookEntity[]): Webhook[] {
  const list: Webhook[] = [];
  for (const at of ats) {
    list.push(mapWebhookEntityToProto(at));
  }

  return list;
}
