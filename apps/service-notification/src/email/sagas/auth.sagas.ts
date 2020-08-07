import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { InjectQueue } from '@nestjs/bull';
import {
  EmailVerifiedEvent,
  ForgotPasswordSentEvent,
  UserLoggedInEvent,
  UserRegisteredEvent,
  VerificationEmailSentEvent,
} from '@ultimatebackend/core/cqrs';
import { Queue } from 'bull';
import { QUEUE_PROCESS_IDS } from '../email.constants';

@Injectable()
export class AuthSagas {
  logger = new Logger(this.constructor.name);

  constructor(@InjectQueue('notification_queue') readonly queue: Queue) {}

  @Saga()
  userLoggedIn = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserLoggedInEvent),
      delay(1000),
      map((event) => {
        // this.logger.log(JSON.stringify(event.user));

        // if (event.user) { this.queue.add(QUEUE_PROCESS_IDS.UserLoggedIn, event.user, { removeOnComplete: true, attempts: 3}); }
        return null;
      }),
    );
  };

  @Saga()
  resetPassword = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ForgotPasswordSentEvent),
      delay(1000),
      map((event) => {
        this.logger.log(JSON.stringify(event.user));
        if (event.user) {
          this.queue.add(QUEUE_PROCESS_IDS.ResetPassword, event.user, {
            removeOnComplete: true,
            attempts: 3,
          });
        }
        return null;
      }),
    );
  };

  @Saga()
  userRegistered = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegisteredEvent),
      delay(1000),
      map((event) => {
        this.logger.log(JSON.stringify(event.user));
        if (event.user.service === 'social') {
          this.queue.add(QUEUE_PROCESS_IDS.EmailVerified, event.user, {
            removeOnComplete: true,
            attempts: 3,
          });
        } else {
          this.queue.add(QUEUE_PROCESS_IDS.UserRegistered, event.user, {
            removeOnComplete: true,
            attempts: 3,
          });
        }
        return null;
      }),
    );
  };

  @Saga()
  resendVerificationCode = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(VerificationEmailSentEvent),
      delay(1000),
      map((event) => {
        this.logger.log(JSON.stringify(event.user));
        this.queue.add(QUEUE_PROCESS_IDS.SendVerificationCode, event.user, {
          removeOnComplete: true,
          attempts: 3,
        });
        return null;
      }),
    );
  };

  @Saga()
  emailVerified = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(EmailVerifiedEvent),
      delay(1000),
      map((event) => {
        this.logger.log(JSON.stringify(event.user));
        this.queue.add(QUEUE_PROCESS_IDS.EmailVerified, event.user, {
          removeOnComplete: true,
          attempts: 3,
        });
        return null;
      }),
    );
  };
}
