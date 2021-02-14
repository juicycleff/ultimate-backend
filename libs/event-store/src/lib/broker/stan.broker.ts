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
 * File name:         stan.broker.ts
 * Last modified:     14/02/2021, 17:24
 ******************************************************************************/
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IEvent, IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { LoggerUtil } from '@ultimate-backend/common';
import { StanClient } from '../client';

@Injectable()
export class StanBroker implements IEventPublisher, OnModuleDestroy, OnModuleInit, IMessageSource {
  private logger = new LoggerUtil(this.constructor.name);

  constructor(
    private readonly stan: StanClient
  ) {}

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    // TODO: Fix soon
  }

  onModuleDestroy(): any {
    // TODO: Fix soon
  }

  onModuleInit(): any {
    // TODO: Fix soon
  }

  publish<T extends IEvent>(event: T): any {
    // TODO: Fix soon
  }

  publishAll<T extends IEvent>(events: T[]): any {
    // TODO: Fix soon
  }

}
