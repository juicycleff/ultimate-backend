import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRegisteredEvent } from '@graphqlcqrs/core';
import { delay, map, switchMap } from 'rxjs/operators';
import { Saga, ICommand, ofType, CommandBus } from '@nestjs/cqrs';
import { CreateStripeCustomerCommand } from '../cqrs/command/impl/billing';

@Injectable()
// @ts-ignore
export class BillingSagas {
  logger = new Logger(this.constructor.name);

  public constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Saga()
  userRegistered = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(UserRegisteredEvent),
        delay(1000),
        switchMap( async ({ user }) => {
          this.logger.log(JSON.stringify(user));
          await this.updateUser(user);
          return null;
        }),
      );
  }

  async updateUser(user) {
    try {
      await this.commandBus.execute(new CreateStripeCustomerCommand(user));
    } catch (e) {
      this.logger.error(e);
    }
  }
}
