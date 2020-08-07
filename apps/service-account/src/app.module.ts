import { Module } from '@nestjs/common';
import { MongoModule } from '@juicycleff/repo-orm';
import {
  CoreModule,
  MongoConfigService,
  ServiceRegistryModule,
} from '@ultimatebackend/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ServiceRegistryModule,
    CoreModule,
    MongoModule.registerAsync({
      useClass: MongoConfigService,
    }),
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
