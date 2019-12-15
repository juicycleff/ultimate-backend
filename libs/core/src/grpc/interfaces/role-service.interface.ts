import { Observable } from 'rxjs';

export interface IRoleService {
  checkPermission(data: { params: string[] }): Observable<any>;
  addPolicy(data: { params: string[] }): Observable<any>;
}
