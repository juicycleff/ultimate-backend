import { Injectable, Logger } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import * as Stripe from 'stripe';

@Injectable()
// @ts-ignore
export class CardSagas {
  logger = new Logger(this.constructor.name);

  public constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
  ) {}
}
