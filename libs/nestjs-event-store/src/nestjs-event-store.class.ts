import { TCPClient, EventFactory} from 'geteventstore-promise2';

/**
 * @description Event store setup from eventstore.com
 */
export class NestjsEventStore {
  [x: string]: any;

  constructor() {
    // @ts-ignore
    this.type = 'event-store';
    // @ts-ignore
    this.eventFactory = new EventFactory();
  }

  connect(config) {
    // @ts-ignore
    this.client = new TCPClient(config);
    return this;
  }

  getClient() {
    return this.client;
  }

  newEvent(name, payload) {
    return this.eventFactory.newEvent(name, payload);
  }

  close() {
    this.client.close();
    return this;
  }
}
