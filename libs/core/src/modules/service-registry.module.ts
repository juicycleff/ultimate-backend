import { CacheModule, Global, Module } from '@nestjs/common';
import { LoadbalanceModule } from '@nestcloud/loadbalance';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';
import { MemcachedModule } from '@nestcloud/memcached';
import { ConfigModule } from '@nestcloud/config';
import { ScheduleModule } from '@nestcloud/schedule';
import { ConsulModule } from '@nestcloud/consul';
import { BootModule } from '@nestcloud/boot';
import { ServiceModule } from '@nestcloud/service';
import { LoggerModule } from '@nestcloud/logger';
import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { CacheStoreConfigService, EventstoreConfigService } from '../services';

@Global()
@Module({
  imports: [
    LoggerModule.register(),
    ScheduleModule.register(),
    BootModule.register(__dirname, `bootstrap.yaml`),
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    ConfigModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]}),
    ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
    MemcachedModule.register({dependencies: [NEST_CONSUL]}),
    CacheModule.registerAsync({
      useClass: CacheStoreConfigService,
    }),
    EventStoreModule.registerAsync({
      useClass: EventstoreConfigService,
    }),
  ],
  exports: [
    LoggerModule.register(),
    ScheduleModule.register(),
    BootModule.register(__dirname, `bootstrap.yaml`),
    ConsulModule.register({ dependencies: [NEST_BOOT] }),
    ConfigModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]}),
    ServiceModule.register({ dependencies: [NEST_BOOT, NEST_CONSUL] }),
    LoadbalanceModule.register({ dependencies: [NEST_BOOT] }),
    MemcachedModule.register({dependencies: [NEST_CONSUL]}),
    CacheModule.registerAsync({
      useClass: CacheStoreConfigService,
    }),
    EventStoreModule.registerAsync({
      useClass: EventstoreConfigService,
    }),
  ],
})
export class ServiceRegistryModule {}
