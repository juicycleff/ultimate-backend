import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
