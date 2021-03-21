import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudModule } from '@ultimate-backend/cloud';
import { RedisModule } from '@ultimate-backend/redis';
import { ConsulModule } from '@ultimate-backend/consul';
import { ClientModule } from '@ultimate-backend/client';
import { LoadBalancerModule } from '@ultimate-backend/loadbalancer';
import { BrakesModule } from '@ultimate-backend/brakes';

@Module({
  imports: [
    CloudModule.forRoot({
      registry: {
        discoverer: 'consul',
        service: {
          id: 'adv-example',
          port: 3332,
          address: 'localhost',
          name: 'adv-example',
        },
      },
    }),
    ConsulModule.forRoot({
      host: 'localhost',
      port: '8500',
      debug: true,
    }),
    RedisModule.forRoot({
      redisOptions: {
        host: 'localhost',
        port: 6379,
        db: 0,
      },
    }),
    ClientModule.forRoot(),
    LoadBalancerModule.forRoot({
      services: [{strategy: 'RoundRobinStrategy', name: 'example'}]
    }),
    BrakesModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
