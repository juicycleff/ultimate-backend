import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga, CommandBus } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { StripeUserCreatedEvent } from '@graphqlcqrs/core/cqrs';
import { UpdateUserCommand } from '../cqrs';

@Injectable()
export class UserSagas {
  logger = new Logger(this.constructor.name);

  public constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Saga()
  stripeUserSaga = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(StripeUserCreatedEvent),
        delay(1000),
        switchMap(async ({ customer }) => {
          this.logger.log(`Inside [${this.constructor.name}] Saga`, JSON.stringify(customer));

          try {
            await this.commandBus.execute(new UpdateUserCommand(customer.userId, {
              payment: {
                stripeId: customer.id,
              },
            }));
          } catch (e) {
            this.logger.error(e);
          }
          return null;
        }),
      );
  }
}
