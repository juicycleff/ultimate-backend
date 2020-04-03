import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TenantCreatedEvent } from '@ultimatebackend/core/cqrs';

@Injectable()
export class TenantSagas {
  @Saga()
  tenantCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(TenantCreatedEvent),
        delay(1000),
        map(event => {
          Logger.log('Inside [TenantSagas] Saga', JSON.stringify(event.tenant));
          return null;
        }),
      );
  }
}
