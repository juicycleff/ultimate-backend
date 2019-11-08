import { Module } from '@nestjs/common';
import { CommonModule } from '@graphqlcqrs/common';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    NestjsEventStoreModule.forRoot({
      http: {
        port: parseInt(process.env.ES_HTTP_PORT, 10) || AppConfig.eventstore?.httpPort,
        protocol: parseInt(process.env.ES_HTTP_PROTOCOL, 10) || AppConfig.eventstore?.httpProtocol,
      },
      tcp: {
        credentials: {
          password: AppConfig.eventstore?.tcpPassword,
          username: AppConfig.eventstore?.tcpUsername,
        },
        hostname: process.env.ES_TCP_HOSTNAME || AppConfig.eventstore?.hostname,
        port: parseInt(process.env.ES_HTTP_PORT, 10) || AppConfig.eventstore?.tcpPort,
        protocol: AppConfig.eventstore?.tcpProtocol,
      },
    }),
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API,
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
