import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudModule } from '@ultimate-backend/cloud';
import { RedisModule } from '@ultimate-backend/redis';
import { ConsulModule } from '@ultimate-backend/consul';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
