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
 * File name:         consul.config.ts
 * Last modified:     26/03/2021, 16:51
 ******************************************************************************/
import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { BootConfig } from '@ultimate-backend/bootstrap';
import { InjectConsulOption } from './decorators';
import { ConsulModuleOptions } from './consul-module.options';
import { merge, isPlainObject, isEmpty } from 'lodash';

@Injectable()
export class ConsulConfig implements OnModuleInit {
  private options: ConsulModuleOptions;
  private CONFIG_PREFIX = 'clients.consul';

  constructor(
    @InjectConsulOption() private opts: ConsulModuleOptions,
    @Optional() private readonly bootConfig: BootConfig
  ) {}

  get config(): ConsulModuleOptions {
    return this.options;
  }

  onModuleInit() {
    let _tempConfig = {};
    if (this.bootConfig) {
      _tempConfig = this.bootConfig.get<ConsulModuleOptions>(
        this.CONFIG_PREFIX,
        this.opts
      );
    }

    if (this.opts) {
      this.options = merge({}, this.opts, this.options, _tempConfig);
    }

    if (!isPlainObject(this.options) || isEmpty(this.options)) {
      throw new Error(
        'etcd configuration option is missing in bootstrap and module config'
      );
    }
  }
}
