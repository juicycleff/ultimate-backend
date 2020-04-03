import { Module } from '@nestjs/common';
import { StripeClientService } from './stripe-client/stripe-client.service';

@Module({
  providers: [StripeClientService],
  exports: [StripeClientService],
})
export class CommonModule {}
