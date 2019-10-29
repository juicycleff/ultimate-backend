import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { EmailVerifiedEvent, UserLoggedInEvent, UserRegisteredEvent } from '@graphqlcqrs/core/cqrs';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';

@Injectable()
export class AuthSagas {
  constructor(@InjectQueue('auth_queue') readonly queue: Queue) {}

  @Saga()
  userLoggedIn = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(UserLoggedInEvent),
        delay(1000),
        map( event => {
          Logger.log('Inside [AuthSagas] Saga', JSON.stringify(event.user));
          this.queue.add('UserLoggedIn', event.user);
          return null;
        }),
      );
  }

  @Saga()
  userRegistered = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(UserRegisteredEvent),
        delay(1000),
        map( event => {
          Logger.log('Inside [AuthSagas] Saga', JSON.stringify(event.user));
          this.queue.add('UserRegistered', event.user);
          return null;
        }),
      );
  }

  @Saga()
  emailVerified = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(EmailVerifiedEvent),
        delay(1000),
        map( event => {
          Logger.log('Inside [AuthSagas] Saga', JSON.stringify(event.user));
          this.queue.add('EmailVerified', event.user);
          return null;
        }),
      );
  }
}
