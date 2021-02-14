import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudModule } from '@ultimate-backend/cloud';
import { ConsulModule } from '@ultimate-backend/consul';

@Module({
  imports: [
    ConsulModule.forRoot({
      port: '8500',
      host: 'localhost',
      promisify: true,
      secure: false,
    }),
    CloudModule.forRoot({
      registry: {
        discoverer: 'local',
        service: {
          id: 'example',
          port: 3333,
          name: 'example',
          address: 'localhost',
        },
        discovery: {
          scheme: 'http',
        },
        heartbeat: {
          enabled: true,
          ttlInSeconds: 60,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
