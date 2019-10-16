import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import {join} from 'path';
import {IAwsConfigInterface, IEventSourceConfig} from '../interfaces';
import {SnakeNamingStrategy} from '../strategies/snake-naming.strategy';

export class ConfigService {

  constructor() {
    const nodeEnv = this.nodeEnv;
    dotenv.config({
      path: `${nodeEnv}.env`,
    });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  isEnv(env: string) {
    return this.get('NODE_ENV') === env;
  }

  typeOrmConfig(entities: any[]): TypeOrmModuleOptions {
    // let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    return {
      entities,
      keepConnectionAlive: true,
      // @ts-ignore
      type: this.get('DATABASE_TYPE') || 'cockroachdb',
      host: this.get('COCK_HOST'),
      port: this.getNumber('COCK_PORT'),
      username: this.get('COCK_USERNAME'),
      password: this.get('COCK_PASSWORD'),
      database: this.get('COCK_DATABASE'),
      synchronize: this.nodeEnv === 'development',
      migrations: [join(__dirname, '/migrations/**{.ts,.js}')],
      subscribers: [join(__dirname, '/subscribers/**{.ts,.js}')],
      migrationsRun: true,
      // @ts-ignore
      dropSchema: this.get('DROP_DB') || (this.nodeEnv === 'development'),
      logging: this.nodeEnv === 'development',
      namingStrategy: new SnakeNamingStrategy(),
      cache: {
        type: 'ioredis',
        options: {
          host: this.get('REDIS_HOST'),
          port: this.getNumber('REDIS_PORT'),
        },
      },
    };
  }

  get awsS3Config(): IAwsConfigInterface {
    return {
      accessKeyId: this.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_S3_SECRET_ACCESS_KEY'),
      bucketName: this.get('S3_BUCKET_NAME'),
    };
  }

  get eventSourceConfig(): IEventSourceConfig {
    return {
      hostname: this.get('ES_HOSTNAME'),
      port: this.getNumber('ES_PORT'),
      protocol: this.get('ES_PROTOCOL'),
      credentials: {
        password: this.get('ES_PASSWORD'),
        username: this.get('ES_USERNAME'),
      },
      poolOptions: {
        max: this.getNumber('ES_POOL_MAX'),
        min: this.getNumber('ES_POOL_MIN'),
      },
    };
  }
}
