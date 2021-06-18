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
 * File name:         base.broker.ts
 * Last modified:     25/02/2021, 21:12
 ******************************************************************************/

import { Subject } from 'rxjs';
import { IEvent } from '@nestjs/cqrs';
import { IAdapterStore } from '../adapter.interface';
import { Logger } from '@nestjs/common';
import {
  EventStoreFeatureOptions,
  IEventConstructors,
} from '../interface/feature.options';

export abstract class BaseBroker {
  // special adapter for optionally storing events in an external store
  protected readonly store: IAdapterStore;

  // streaming topic for all new events
  protected readonly streamName: string;

  // all event handlers passed in constructor
  protected eventHandlers: IEventConstructors = {};

  protected subject$: Subject<IEvent>;

  protected logger = new Logger(this.constructor.name);

  protected constructor(
    featureStreamConfig: EventStoreFeatureOptions,
    logContext: string
  ) {
    this.logger = new Logger(logContext);
    this.streamName = featureStreamConfig.streamName;
    this.eventHandlers = featureStreamConfig.eventHandlers;
    this.store = featureStreamConfig.store;
  }

  protected addEventHandlers(eventHandlers: IEventConstructors) {
    this.eventHandlers = { ...this.eventHandlers, ...eventHandlers };
  }

  protected getStreamId(stream) {
    return `${stream}`;
  }

  protected onLiveProcessingStarted() {
    this.logger.log('Live processing of EventStore events started!');
  }
}
