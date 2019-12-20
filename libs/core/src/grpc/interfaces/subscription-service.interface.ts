import { Observable } from 'rxjs';

export interface ISubscriptionService {
  create(data: { tenantId: string, userId: string, customerId: string, planId: string, couponId?: string  }): Observable<any>;
  findOne(data: {tenantId: string, userId: string, customerId: string }): Observable<any>;
}
