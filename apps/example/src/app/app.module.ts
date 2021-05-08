import { Module } from '@nestjs/common';
import { CloudModule } from '@ultimate-backend/cloud';
import { ConsulModule } from '@ultimate-backend/consul';
import { ClientModule } from '@ultimate-backend/client';
import { LoadBalancerModule } from '@ultimate-backend/loadbalancer';
import { BrakesModule } from '@ultimate-backend/brakes';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CloudModule.forRoot({
      registry: {
        discoverer: 'consul',
        service: {
          id: 'example',
          port: 3333,
          name: 'example',
          address: 'localhost',
        },
        heartbeat: {
          enabled: true,
          ttlInSeconds: 60,
        },
      },
    }),
    ConsulModule.forRoot({
      port: '8500',
      host: 'localhost',
      promisify: true,
      secure: false,
    }),
    ClientModule.forRoot(),
    LoadBalancerModule.forRoot(),
    BrakesModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
