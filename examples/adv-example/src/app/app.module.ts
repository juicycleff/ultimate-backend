import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CloudModule } from '@ultimate-backend/cloud';
import { RedisModule } from '@ultimate-backend/redis';
import { ConsulModule } from '@ultimate-backend/consul';
import { ClientModule } from '@ultimate-backend/client';
import { LoadBalancerModule } from '@ultimate-backend/loadbalancer';
import { BrakesModule } from '@ultimate-backend/brakes';
import { GraphQLModule } from '@nestjs/graphql';
import { BootstrapModule } from '@ultimate-backend/bootstrap';
import { EtcdModule } from '@ultimate-backend/etcd';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { AppController } from './app.controller';
import { ConfigModule, ConfigSource } from '@ultimate-backend/config';
import { PermissionsModule } from '@ultimate-backend/permissions';
import * as path from 'path';
import { KubernetesModule } from '@ultimate-backend/kubernetes';

@Module({
  imports: [
    UsersModule,
    PostModule,
    BootstrapModule.forRoot({
      filePath: path.resolve(__dirname, 'assets/bootstrap.yaml'),
    }),
    BrakesModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    PermissionsModule.forRoot({
      polars: {
        polar: path.resolve(__dirname, 'assets/example.polar'),
        file: true,
      },
    }),
    EtcdModule.forRoot({
      etcdOptions: {
        hosts: 'localhost:2379',
      },
    }),
    LoadBalancerModule.forRoot({
      services: [{ strategy: 'RoundRobinStrategy', name: 'example' }],
    }),
    KubernetesModule.forRoot(),
    ConsulModule.forRoot({
      host: 'localhost',
      port: '8500',
      debug: true,
    }),
    ConfigModule.forRoot({
      load: [
        {
          source: ConfigSource.Consul,
          key: 'ultimate-backend-config',
        },
        {
          source: ConfigSource.Kubernetes,
          name: 'ultimate-backend-config',
          key: 'config.yml',
        },
      ],
    }),
    RedisModule.forRoot({
      redisOptions: {
        host: 'localhost',
        port: 6379,
        db: 0,
      },
    }),
    ClientModule.forRoot(),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
