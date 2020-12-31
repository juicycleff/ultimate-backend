import EventEmitter = NodeJS.EventEmitter;
import { Service } from './service.interface';

export interface WatcherResult {
  action?: string;

  service?: Service;
}

/** Watcher is an interface that returns updates
 * about services within the registry.
 **/
export interface Watcher extends EventEmitter {
  next(): WatcherResult;

  /**
   * End watch
   */
  stop(): void;
}
