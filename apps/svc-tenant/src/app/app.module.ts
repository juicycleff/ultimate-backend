import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UbCloudModule } from '@ultimate-backend/cloud';

@Module({
  imports: [
    UbCloudModule.forRoot({
      registry: {
        discoverer: 'consul',
        service: {
          name: 'svc-tenant',
          port: 3000,
          address: 'localhost',
          id: 'my-esther',
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
