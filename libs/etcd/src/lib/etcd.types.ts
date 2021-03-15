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
 * File name:         etcd.types.ts
 * Last modified:     15/03/2021, 02:30
 ******************************************************************************/
import { IEvent, IResponseHeader } from 'etcd3/lib/rpc';

export interface IWatchResponse {
  header: IResponseHeader;
  /**
   * watch_id is the ID of the watcher that corresponds to the response.
   */
  watch_id: string;
  /**
   * created is set to true if the response is for a create watch request.
   * The client should record the watch_id and expect to receive events for
   * the created watcher from the same stream.
   * All events sent to the created watcher will attach with the same watch_id.
   */
  created: boolean;
  /**
   * canceled is set to true if the response is for a cancel watch request.
   * No further events will be sent to the canceled watcher.
   */
  canceled: boolean;
  /**
   * compact_revision is set to the minimum index if a watcher tries to watch
   * at a compacted index.
   *
   * This happens when creating a watcher at a compacted revision or the watcher cannot
   * catch up with the progress of the key-value store.
   *
   * The client should treat the watcher as canceled and should not try to create any
   * watcher with the same start_revision again.
   */
  compact_revision: string;
  /**
   * cancel_reason indicates the reason for canceling the watcher.
   */
  cancel_reason: string;
  /**
   * framgment is true if large watch response was split over multiple responses.
   */
  fragment: boolean;
  events: IEvent[];
}
