import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TenantCreatedEvent } from '@ultimatebackend/core/cqrs';
import { TenantRepository } from '@ultimatebackend/repository';

@Injectable()
export class TenantSagas {
  constructor(private readonly tenantRepository: TenantRepository) {}

  @Saga()
  tenantCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(TenantCreatedEvent),
      delay(500),
      map((event) => {
        Logger.log('Inside [TenantSagas] Saga', JSON.stringify(event.tenant));
        return null;
      }),
    );
  };
}
