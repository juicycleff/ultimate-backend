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
import { INestApplication, Logger } from '@nestjs/common';
import { enableKillGracefully } from '@ultimate-backend/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { BootConfig } from '@ultimate-backend/bootstrap';
import { MultiTenancyConfig } from '../multitenancy/multi-tenant.config';
import { enableMultiTenancy } from '../multitenancy/middleware/multi-tenancy-global.middleware';
import { bloodTearsMiddleware } from './blood-tears.middleware';
import * as path from 'path';

export class UBServiceBuilder {
  private _grpcOptions: GrpcOpts;
  private _swaggerObject: OpenAPIObject;
  private _swaggerPath = 'docs';
  private boot: BootConfig;
  private _prefix: string;

  constructor(private readonly app: INestApplication) {
    this.boot = app.get<BootConfig>(BootConfig);
  }

  withPrefix(prefix: string) {
    this._prefix = prefix;
    return this;
  }

  withPoweredBy() {
    this.app.use(bloodTearsMiddleware);
    return this;
  }

  withMultiTenancy(option: MultiTenancyConfig) {
    this.app.use(enableMultiTenancy(option));
    return this;
  }

  withSwagger(path?: string, options?: SwaggerConfig) {
    if (path) {
      this._swaggerPath = path;
    }

    const title = options?.title || this.boot.get('name', 'ub-service');
    const description =
      options?.description ||
      this.boot.get('description', 'ultimate backend service');
    const version = options?.version || this.boot.get('version', 'latest');
    const tag = options?.description || this.boot.get('tag', 'service');
    const builder  = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag(tag)
      .build();
    this._swaggerObject = SwaggerModule.createDocument(this.app, builder);
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
      SwaggerModule.setup(this._swaggerPath, this.app, this._swaggerObject);
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
