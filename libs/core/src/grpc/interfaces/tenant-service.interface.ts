import { Observable } from 'rxjs';

export interface ITenantService {
  findOneTenant(data: { normalizedName: string, key: string, secret: string }): Observable<any>;
  tenantExist(data: { normalizedName: string, key: string, secret: string }): Observable<any>;
}
