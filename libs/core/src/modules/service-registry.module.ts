import { CacheModule, Global, Module } from '@nestjs/common';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { ConfigModule } from '@nestcloud/config';
import { ScheduleModule } from '@nestcloud/schedule';
import { ConsulModule } from '@nestcloud/consul';
import { BootModule } from '@nestcloud/boot';
import { ServiceModule } from '@nestcloud/service';
import { LoggerModule } from '@nestcloud/logger';
import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { CacheStoreConfigService, EventstoreConfigService } from '../services';
import { TerminusModule } from '@nestjs/terminus';

@Global()
@Module({
  imports: [
    LoggerModule.register(),
    ScheduleModule.register(),
    BootModule.register(
      __dirname,
      `bootstrap-${process.env.NODE_ENV || 'development'}.yaml`,
    ),
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    ConfigModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
    CacheModule.registerAsync({
      useClass: CacheStoreConfigService,
    }),
    EventStoreModule.registerAsync({
      type: 'event-store',
      useClass: EventstoreConfigService,
    }),
    TerminusModule.forRootAsync({
      useFactory: () => ({
        disableDeprecationWarnings: true,
        endpoints: [{ url: '/health', healthIndicators: [] }],
      }),
    }),
  ],
  exports: [
    LoggerModule.register(),
    ScheduleModule.register(),
    BootModule.register(
      __dirname,
      `bootstrap-${process.env.NODE_ENV || 'development'}.yaml`,
    ),
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    ConfigModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
    CacheModule.registerAsync({
      useClass: CacheStoreConfigService,
    }),
    EventStoreModule.registerAsync({
      type: 'event-store',
      useClass: EventstoreConfigService,
    }),
    TerminusModule.forRootAsync({
      useFactory: () => ({
        disableDeprecationWarnings: true,
        endpoints: [{ url: '/health', healthIndicators: [] }],
      }),
    }),
  ],
})
export class ServiceRegistryModule {}
