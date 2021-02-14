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
 * File name:         oso.service.ts
 * Last modified:     18/01/2021, 22:18
 ******************************************************************************/

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Oso } from 'oso';
import { PERMISSION_MODULE_OPTIONS } from './permissions.constants';
import { PermissionsModuleOptions } from './interfaces';
import { TypeMetadataStorage } from './storages';
import { Class } from 'oso/dist/src/types';
import { LoggerUtil } from '@ultimate-backend/common';

@Injectable()
export class OsoService extends Oso implements OnModuleInit {
  logger: LoggerUtil;

  constructor(
    @Inject(PERMISSION_MODULE_OPTIONS)
    private readonly options: PermissionsModuleOptions
  ) {
    super(options.oso);
    this.logger = new LoggerUtil('OsoService', options.debug);
  }

  private async setup() {
    try {
      this.initOso();
      await this.loadPolarFiles();
    } catch (e) {
      this.logger.error(e);
    }
  }

  private initOso() {
    this.logger.log('Initializing started... [Permission]');
    for (const os of TypeMetadataStorage.getOsoMetadata()) {
      this.logger.log(`register ${os.target.name}...`);
      this.registerClass(os.target as Class);
    }
  }

  private async loadPolarFiles() {
    if (!Array.isArray(this.options.polars)) {
      if (typeof this.options.polars === 'string') {
        await this.loadStr(this.options.polars);
      } else if (this.options.polars.file) {
        await this.loadFile(this.options.polars.polar);
      } else {
        await this.loadStr(this.options.polars.polar, this.options.polars.name);
      }
    } else {
      for (const po of this.options.polars) {
        if (typeof po === 'string') {
          await this.loadStr(po);
        } else {
          if (po.file) {
            await this.loadFile(po.name);
          } else {
            await this.loadStr(po.polar, po.name);
          }
        }
      }
    }
    this.logger.log('Initializing completed... [Permission]');
  }

  async onModuleInit(): Promise<void> {
    await this.setup();
  }
}
