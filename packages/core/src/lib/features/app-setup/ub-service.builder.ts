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
import { GrpcOpts, SwaggerConfig } from './grpc-opts';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { enableKillGracefully } from '@ultimate-backend/common';
import { BootConfig } from '@ultimate-backend/bootstrap';
import { MultiTenancyConfig } from '../multitenancy/multi-tenant.config';
import { enableMultiTenancy } from '../multitenancy/middleware/multi-tenancy-global.middleware';
import { bloodTearsMiddleware } from './blood-tears.middleware';
import * as path from 'path';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { CookieOptions, SessionOptions, SwaggerCustomOptions, SwaggerDocumentOptions } from './types';

type CSurfType = {
  value?: (req: any) => string;
  cookie?: CookieOptions | boolean;
  ignoreMethods?: string[];
  sessionKey?: string;
};

export class UBServiceBuilder {
  private _grpcOptions: GrpcOpts;
  private _swaggerObject: any;
  private _swaggerPath = 'docs';
  private _swaggerCustomOpts;
  private boot: BootConfig;
  private _prefix: string;
  private _swaggerOptions: Record<string, any>;

  constructor(private readonly app: INestApplication, private readonly isFastify: boolean = false) {
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
    const csurf = loadPackage(
      'csurf',
      'csurf',
      () => require('csurf')
    );
    const helmet = loadPackage(
      'helmet',
      'helmet',
      () => require('helmet')
    );

    let config = options;
    if (!options) {
      config = this.boot.get('security', {});
    }
    // When no config is provided. It will use the default behavior
    const hasNoKeys = Object.keys(config).length === 0;
    if (hasNoKeys || config.helmet) {
      this.app.use(helmet(config.helmet));
    }
    if (hasNoKeys || config.cors) {
      this.app.enableCors(config.cors);
    }
    if (hasNoKeys || config.csurf) {
      this.app.use(csurf(config.csurf));
    }
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

  withSession(useRedisStore?: boolean, opts?: SessionOptions | string) {
    const connectRedis = loadPackage(
      'connect-redis',
      'connect-redis',
      () => require('connect-redis')
    );

    const Redis = loadPackage(
      'ioredis',
      'ioredis',
      () => require('ioredis')
    );

    const session = loadPackage(
      'express-session',
      'express-session',
      () => require('express-session')
    );

    const RedisSessionStore = connectRedis(session);

    let config = {} as SessionOptions;

    if (!opts) {
      config = this.boot.get('setup.session', {}) as SessionOptions;
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
      const redisClient = new Redis(redisConfig);
      config.store = new RedisSessionStore({ client: redisClient });
    }

    this.app.use(session(config));
    return this;
  }

  withCookie(
    opts?:
      | {
          secret?: string | string[];
          options?: Record<string, any>;
        }
      | string
  ) {
    const cookieParser = loadPackage(
      'cookie-parser',
      'cookie-parser',
      () => require('cookie-parser')
    );

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
    this._swaggerOptions = {
      path,
      options,
      customOpts,
      docOpts,
    };
    return this;
  }

  withGrpc(options?: GrpcOpts) {
    if (!options) {
      this._grpcOptions = this.boot.get('transport.grpc');
      if (this._grpcOptions && this._grpcOptions.protoPath) {
        if (Array.isArray(this._grpcOptions.protoPath)) {
          const protoPath = [];
          for (const proto of this._grpcOptions.protoPath) {
            if (proto.startsWith('dist/examples')) {
              protoPath.push(path.resolve(process.cwd(), proto));
            }
          }
          this._grpcOptions.protoPath = protoPath;
        } else if (this._grpcOptions.protoPath.startsWith('dist/examples')) {
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

  prepareSwagger() {
    if (!this._swaggerOptions) return;

    const swaggerPackage = loadPackage(
      '@nestjs/swagger',
      '@nestjs/swagger',
      () => require('@nestjs/swagger')
    );

    const { path, customOpts, docOpts } = this._swaggerOptions;
    let { options } = this._swaggerOptions;
    if (path) {
      this._swaggerPath = path;
    }

    if (customOpts) {
      this._swaggerCustomOpts = customOpts;
    }

    options = options || this.boot.get('swagger.options');
    const title = options?.title || this.boot.get('name', 'ub-service');
    const description =
      options?.description ||
      this.boot.get('description', 'ultimate backend service');
    const version = options?.version || this.boot.get('version', 'latest');
    const tag = options?.description || this.boot.get('tag', 'service');
    const builder = new swaggerPackage.DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag(tag);

    if (options?.basePath) {
      builder.setBasePath(options?.basePath);
    }

    if (options?.auth) {
      switch (options?.auth?.authType) {
        case 'bearer':
          builder.addBearerAuth(options.auth.options, options.auth.name);
          break;
        case 'basic':
          builder.addBasicAuth(options.auth.options, options.auth.name);
          break;
        case 'oauth2':
          builder.addOAuth2(options.auth.options, options.auth.name);
          break;
        case 'cookie':
          builder.addCookieAuth(options.auth.options, options.auth.name);
          break;
        case 'apiKey':
          builder.addApiKey(options.auth.options, options.auth.name);
          break;
        default:
          break;
      }
    }

    this._swaggerObject = swaggerPackage.SwaggerModule.createDocument(
      this.app,
      builder.build(),
      docOpts
    );
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
      const impPkg = loadPackage(
        '@nestjs/microservices',
        '@nestjs/microservices',
        () => require('@nestjs/microservices')
      );

      this.app.connectMicroservice({
        transport: impPkg.Transport.GRPC,
        options: this._grpcOptions,
      });
    }
  }

  private createSwaggerDocument() {
    if (this._swaggerObject) {
      const swaggerPackage = loadPackage(
        '@nestjs/swagger',
        '@nestjs/swagger',
        () => require('@nestjs/swagger')
      );

      swaggerPackage.SwaggerModule.setup(
        this._swaggerPath,
        this.app,
        this._swaggerObject,
        this._swaggerCustomOpts
      );
    }
  }

  async start(port?: number, host?: string) {
    if (this._prefix) {
      this.app.setGlobalPrefix(this._prefix);
    }

    // prepare swagger
    this.prepareSwagger();

    enableKillGracefully(this.app);
    this.createSwaggerDocument();
    this.connectGrpc();

    const appPort = port || this.boot.get('port', 3000);
    if (this.isFastify) {
      const appHost = host || this.boot.get('host', '0.0.0.0');
      await this.app.listen(appPort, appHost);
    } else {
      await this.app.listen(appPort);
    }

    // print messages to console
    this.printSwaggerInfo(appPort);
    this.printRestInfo(appPort);
    this.printGrpcInfo();
  }
}
