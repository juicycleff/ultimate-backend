/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         ub-service.builder.ts
 * Last modified:     03/04/2021, 01:04
 ******************************************************************************/
import { Transport } from '@nestjs/microservices';
import { GrpcOpts, SwaggerConfig } from './grpc-opts';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { enableKillGracefully } from '@ultimate-backend/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger/dist/interfaces';
import { BootConfig } from '@ultimate-backend/bootstrap';
import { MultiTenancyConfig } from '../multitenancy/multi-tenant.config';
import { enableMultiTenancy } from '../multitenancy/middleware/multi-tenancy-global.middleware';
import { bloodTearsMiddleware } from './blood-tears.middleware';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as connectRedis from 'connect-redis';
import * as redis from 'ioredis';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

type CSurfType = {
  value?: (req: any) => string;
  cookie?: csurf.CookieOptions | boolean;
  ignoreMethods?: string[];
  sessionKey?: string;
};

const RedisSessionStore = connectRedis(session);

export class UBServiceBuilder {
  private _grpcOptions: GrpcOpts;
  private _swaggerObject: OpenAPIObject;
  private _swaggerPath = 'docs';
  private _swaggerCustomOpts;
  private boot: BootConfig;
  private _prefix: string;

  constructor(private readonly app: INestApplication) {
    this.boot = app.get<BootConfig>(BootConfig);
  }

  withPrefix(prefix: string) {
    this._prefix = prefix;
    this.app.setGlobalPrefix(prefix);
    return this;
  }

  withPoweredBy() {
    this.app.use(bloodTearsMiddleware);
    return this;
  }

  hardenedSecurity(
    options: {
      helmet?: any;
      cors?: CorsOptions | CorsOptionsDelegate<any>;
      csurf?: CSurfType;
    } = {}
  ) {
    let config = options;
    if (!options) {
      config = this.boot.get('security', {});
    }
    this.app.use(helmet(config.helmet));
    this.app.enableCors(config.cors);
    this.app.use(csurf(config.csurf));
    return this;
  }

  withValidation(options?: ValidationPipeOptions) {
    this.app.useGlobalPipes(new ValidationPipe(options));
    return this;
  }

  withMultiTenancy(option?: MultiTenancyConfig | string) {
    let config;
    if (!option) {
      config = this.boot.get('multitenancy');
    }

    if (typeof option === 'string') {
      config = this.boot.get(option);
    } else if (typeof option === 'object') {
      config = option;
    }

    if (!config) {
      throw new Error(
        'Missing multitenancy configuration. You provide through boostrap config with default key: [multitenancy]'
      );
    }

    this.app.use(enableMultiTenancy(config));
    return this;
  }

  withSession(opts?: session.SessionOptions | string, useRedisStore?: boolean) {
    let config = {} as session.SessionOptions;

    if (!opts) {
      config = this.boot.get('setup.session', {}) as session.SessionOptions;
    }

    if (typeof opts === 'string') {
      config = this.boot.get(opts);
    } else if (typeof opts === 'object') {
      config = opts;
    }

    if (useRedisStore) {
      const redisConfig = this.boot.get('clients.redis');
      if (!redisConfig)
        throw new Error(
          'Missing redis configuration. You can supply it using the bootstrap config with key clients.redis using dot notation.'
        );
      const redisClient = redis(redisConfig);
      config.store = new RedisSessionStore({ client: redisClient });
    }

    this.app.use(session(config));
    return this;
  }

  withCookie(
    opts?:
      | {
          secret?: string | string[];
          options?: cookieParser.CookieParseOptions;
        }
      | string
  ) {
    let config = {} as any;
    if (!opts) {
      config = this.boot.get('setup.cookie', {});
    }

    if (typeof opts === 'string') {
      config = this.boot.get(opts);
    } else if (typeof opts === 'object') {
      config = opts;
    }

    this.app.use(cookieParser(config.secret, config.options));
    return this;
  }

  withSwagger(
    path?: string,
    options?: SwaggerConfig,
    customOpts?: SwaggerCustomOptions,
    docOpts?: SwaggerDocumentOptions
  ) {
    if (path) {
      this._swaggerPath = path;
    }

    if (customOpts) {
      this._swaggerCustomOpts = customOpts;
    }

    const title = options?.title || this.boot.get('name', 'ub-service');
    const description =
      options?.description ||
      this.boot.get('description', 'ultimate backend service');
    const version = options?.version || this.boot.get('version', 'latest');
    const tag = options?.description || this.boot.get('tag', 'service');
    const builder = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag(tag)
      .build();
    this._swaggerObject = SwaggerModule.createDocument(
      this.app,
      builder,
      docOpts
    );
    return this;
  }

  withGrpc(options?: GrpcOpts) {
    if (!options) {
      this._grpcOptions = this.boot.get('transport.grpc');
      if (this._grpcOptions && this._grpcOptions.protoPath) {
        if (Array.isArray(this._grpcOptions.protoPath)) {
          const protoPath = [];
          for (const proto of this._grpcOptions.protoPath) {
            if (proto.startsWith('dist/apps')) {
              protoPath.push(path.resolve(process.cwd(), proto));
            }
          }
          this._grpcOptions.protoPath = protoPath;
        } else if (this._grpcOptions.protoPath.startsWith('dist/apps')) {
          this._grpcOptions.protoPath = path.resolve(
            process.cwd(),
            this._grpcOptions.protoPath
          );
        }
      }
    } else {
      this._grpcOptions = options;
    }

    if (!this._grpcOptions) {
      throw new Error(
        'grpc transport options must be provide in boot config or by options'
      );
    }

    return this;
  }

  private printGrpcInfo() {
    if (this._grpcOptions) {
      Logger.log(
        `GRPC listening on host: ${this._grpcOptions.url}`,
        'UBService'
      );
    }
  }

  private printRestInfo(port: number) {
    Logger.log(
      `REST api listening on host: http://localhost:${port}${
        this._prefix ? '/' + this._prefix : ''
      }`,
      'UBService'
    );
  }

  private printSwaggerInfo(port: number) {
    if (this._swaggerObject) {
      Logger.log(
        `Swagger Docs for service available at: http://localhost:${port}/${this._swaggerPath}`,
        'UBService'
      );
    }
  }

  private connectGrpc() {
    if (this._grpcOptions) {
      this.app.connectMicroservice({
        transport: Transport.GRPC,
        options: this._grpcOptions,
      });
    }
  }

  private createSwaggerDocument() {
    if (this._swaggerObject) {
      SwaggerModule.setup(
        this._swaggerPath,
        this.app,
        this._swaggerObject,
        this._swaggerCustomOpts
      );
    }
  }

  async start(port?: number) {
    if (this._prefix) {
      this.app.setGlobalPrefix(this._prefix);
    }

    enableKillGracefully(this.app);
    this.createSwaggerDocument();
    this.connectGrpc();

    const appPort = port || this.boot.get('port', 3000);
    await this.app.listen(appPort);

    // print messages to console
    this.printSwaggerInfo(appPort);
    this.printRestInfo(appPort);
    this.printGrpcInfo();
  }
}
