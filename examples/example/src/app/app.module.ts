import { Module } from '@nestjs/common';
import { CloudModule } from '@ultimate-backend/cloud';
import { ClientModule } from '@ultimate-backend/client';
import { LoadBalancerModule } from '@ultimate-backend/loadbalancer';
import { BrakesModule } from '@ultimate-backend/brakes';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootstrapModule } from '@ultimate-backend/bootstrap';
import * as path from 'path';

@Module({
  imports: [
    CloudModule.forRoot({
      registry: {
        discoverer: 'local',
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
    BootstrapModule.forRoot({
      filePath: path.resolve(__dirname, 'assets/bootstrap.yaml'),
      enableEnv: true,
    }),
    ClientModule.forRoot(),
    LoadBalancerModule.forRoot(),
    BrakesModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
