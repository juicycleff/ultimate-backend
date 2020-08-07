import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import {
  StripeUserCreatedEvent,
  UserLoggedInEvent,
} from '@ultimatebackend/core/cqrs';
import { UpdateUserCommand } from '../cqrs';

@Injectable()
export class AccountSagas {
  logger = new Logger(this.constructor.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @Saga()
  authCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserLoggedInEvent),
      delay(1000),
      map((event) => {
        Logger.log('Inside [AuthSagas] Saga', JSON.stringify(event.user));
        return null;
      }),
    );
  };

  @Saga()
  stripeUserSaga = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(StripeUserCreatedEvent),
      delay(1000),
      switchMap(async ({ customer }) => {
        this.logger.log(
          `Inside [${this.constructor.name}] Saga`,
          JSON.stringify(customer),
        );

        try {
          await this.commandBus.execute(
            new UpdateUserCommand(customer.userId, {
              // @ts-ignore
              payment: {
                stripeId: customer.id,
              },
            }),
          );
        } catch (e) {
          this.logger.error(e);
        }
        return null;
      }),
    );
  };
}
