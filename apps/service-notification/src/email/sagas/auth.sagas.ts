import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { EmailVerifiedEvent, UserLoggedInEvent, UserRegisteredEvent, VerificationEmailSentEvent } from '@graphqlcqrs/core/cqrs';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';

@Injectable()
export class AuthSagas {
  logger = new Logger(this.constructor.name);

  constructor(@InjectQueue('auth_queue') readonly queue: Queue) {}

  @Saga()
  userLoggedIn = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(UserLoggedInEvent),
        delay(1000),
        map( event => {
          this.logger.log(JSON.stringify(event.user));

          if (event.user) { this.queue.add('UserLoggedIn', event.user); }
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
          this.logger.log(JSON.stringify(event.user));
          this.queue.add('UserRegistered', event.user);
          return null;
        }),
      );
  }

  @Saga()
  resendVerificationCode = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(VerificationEmailSentEvent),
        delay(1000),
        map( event => {
          this.logger.log(JSON.stringify(event.user));
          this.queue.add('SendVerificationCode', event.user);
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
          this.logger.log(JSON.stringify(event.user));
          this.queue.add('EmailVerified', event.user);
          return null;
        }),
      );
  }
}
