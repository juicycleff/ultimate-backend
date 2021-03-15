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
 * File name:         etcd.client.ts
 * Last modified:     07/02/2021, 12:15
 ******************************************************************************/

import { BeforeApplicationShutdown, Inject, Injectable } from '@nestjs/common';
import { IReactiveClient } from '@ultimate-backend/common';
import { Etcd3 } from 'etcd3';
import { ETCD_CONFIG_OPTIONS } from './etcd.constant';
import { EtcdModuleOptions } from './etcd-module.options';

@Injectable()
export class EtcdClient
  extends Etcd3
  implements IReactiveClient<Etcd3>, BeforeApplicationShutdown {
  constructor(
    @Inject(ETCD_CONFIG_OPTIONS) private readonly opts: EtcdModuleOptions
  ) {
    super(opts.etcdOptions);
  }

  close(): any | Promise<void> {
    super.close();
  }

  async connect(): Promise<void> {
    throw new Error('not implemented');
  }

  beforeApplicationShutdown(signal?: string): any {
    this.close();
  }
}
