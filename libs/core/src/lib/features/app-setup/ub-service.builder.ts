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
import { INestApplication } from '@nestjs/common';
import { enableKillGracefully } from '@ultimate-backend/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { BootConfig } from '@ultimate-backend/boostrap';

export class UbServiceBuilder {
  private _grpcOptions: GrpcOpts;
  private _swaggerObject: OpenAPIObject;
  private _swaggerPath = 'docs';
  private boot: BootConfig;

  constructor(private readonly app: INestApplication) {
    this.boot = app.get<BootConfig>(BootConfig);
  }

  withMultiTenancy() {
    return this;
  }

  withSwagger(path?: string, options?: SwaggerConfig) {
    if (path) {
      this._swaggerPath = path;
    }

    const title = options?.title || this.boot.get('app.name');
    const description = options?.description || this.boot.get('app.description', 'ultimate backend service');
    const version = options?.version || this.boot.get('app.version', 'latest');
    const tag = options?.description || this.boot.get('app.tag', 'service');
    this._swaggerObject = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag(tag)
      .build() as OpenAPIObject;
    return this;
  }

  withGrpc(options: GrpcOpts) {
    this._grpcOptions = options;
    return this;
  }

  private connectGrpc() {
    if (this._grpcOptions) {
      this.app.connectMicroservice({
        transport: Transport.GRPC,
        options: this._grpcOptions,
      })
    }
  }

  private createSwaggerDocument() {
    if (this._swaggerObject) {
      SwaggerModule.setup(this._swaggerPath, this.app, this._swaggerObject);
    }
  }

  start() {
    enableKillGracefully(this.app);
    this.createSwaggerDocument();

    this.connectGrpc();
  }
}
