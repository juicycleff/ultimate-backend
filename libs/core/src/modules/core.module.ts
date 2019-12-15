import { CacheModule, Global, HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsEventStoreModule } from '@juicycleff/nestjs-event-store';
import { AwsS3Service, ConfigService, GeneratorService, ValidatorService, AppLogger } from '../services';
import { CookieSerializer } from '@graphqlcqrs/common';
import { AppConfig, YamlService } from '@graphqlcqrs/common/services/yaml.service';

const providers = [ConfigService, ValidatorService, AwsS3Service, GeneratorService, AppLogger];

@Global()
@Module({
  imports: [
    HttpModule,
    CqrsModule,
    CacheModule.register(),
    NestjsEventStoreModule.forRoot({
      tcpEndpoint: {
        host: process.env.ES_TCP_HOSTNAME || AppConfig.eventstore?.hostname,
        port: parseInt(process.env.ES_TCP_PORT, 10) || AppConfig.eventstore?.tcpPort,
      },
      options: {
        defaultUserCredentials: {
          password: AppConfig.eventstore?.tcpPassword,
          username: AppConfig.eventstore?.tcpUsername,
        },
      },
    }),
  ],
  providers: [
    ...providers,
    YamlService,
    CookieSerializer,
  ],
  exports: [
    CqrsModule,
    CacheModule,
    ...providers,
    HttpModule,
    YamlService,
    CookieSerializer,
    NestjsEventStoreModule.forRoot({
      tcpEndpoint: {
        host: process.env.ES_TCP_HOSTNAME || AppConfig.eventstore?.hostname,
        port: parseInt(process.env.ES_TCP_PORT, 10) || AppConfig.eventstore?.tcpPort,
      },
      options: {
        defaultUserCredentials: {
          password: AppConfig.eventstore?.tcpPassword,
          username: AppConfig.eventstore?.tcpUsername,
        },
      },
    }),
  ],
})
export class CoreModule {}
