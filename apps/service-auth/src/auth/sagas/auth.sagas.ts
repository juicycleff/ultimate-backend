import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthCreatedEvent } from '@graphqlcqrs/core/cqrs';

@Injectable()
export class AuthSagas {
  @Saga()
  authCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(AuthCreatedEvent),
        delay(1000),
        map(event => {
          Logger.log('Inside [AuthSagas] Saga', JSON.stringify(event.auth));
          return null;
        }),
      );
  }
}
