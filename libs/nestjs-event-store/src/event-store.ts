import { Inject, Injectable, Logger } from '@nestjs/common';
import { IEvent, IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import axios from 'axios';
import { Subject } from 'rxjs';
import { EventStoreOptionConfig } from './event-store-option.config';
import { ProvidersConstants } from './nestjs-event-store.constant';
import { IEventStoreConnectConfig } from './contract/event-store-connect-config.interface';

/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
  private eventStore: any;
  private eventHandlers: object;
  private readonly category: string | string [];
  private readonly eventStoreHostUrl: string;
  private readonly resolveLinkTos: boolean;

  constructor(
    @Inject(ProvidersConstants.EVENT_STORE_PROVIDER) eventStore: any,
    @Inject(ProvidersConstants.EVENT_STORE_CONNECTION_CONFIG_PROVIDER) configService: IEventStoreConnectConfig,
    @Inject(ProvidersConstants.EVENT_STORE_STREAM_CONFIG_PROVIDER) esStreamConfig: EventStoreOptionConfig,
  ) {
    this.category = esStreamConfig.name;
    this.resolveLinkTos = esStreamConfig.resolveLinkTos;
    this.eventStore = eventStore;
    this.eventStore.connect(configService.tcp);

    this.eventStoreHostUrl = configService.http.protocol +
      `://${configService.tcp.hostname}:${configService.http.port}/streams/`;
  }

  async publish<T extends IEvent>(event: T) {

    if (event === undefined) { return; }
    if (event === null) { return; }

    const category = Object.keys(event)[0];

    const categoryId = event[category].id;
    const streamName = `${category}-${categoryId}`;
    const type = event.constructor.name;
    try {
      await this.eventStore.client.writeEvent(streamName, type, event);
    } catch (err) {
      Logger.error(err, err, 'EventStore');
    }
  }

  /**
   * @description Event Store bridge subscribes to domain category stream
   * @param subject
   */
  async bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {

    if (Array.isArray(this.category)) {
      return;
    }

    const streamName = `$ce-${this.category}`;
    const onEvent = async (event) => {
      if (event.isJson && typeof event.data !== 'string') {
        const eventType = event.eventType;
        const data = event.data;
        event = this.eventHandlers[eventType](...Object.values(data));
        subject.next(event);
      } else {
        const eventUrl =  `${this.eventStoreHostUrl}${event.metadata.$o}/${event.data.split('@')[0]}?embed=body`;
        return axios.get(eventUrl, {
          responseType: 'stream',
          headers: {Accept: 'application/vnd.eventstore.atom+json'},
        }).then((response) => {
          const stream = response.data;
          let rawData = '';
          stream.on('data', (chunk) => { rawData += chunk; });
          stream.on('end', () => {
            const temp = JSON.parse(rawData);
            const data = temp.content.data;
            const eventType = temp.content.eventType;
            event = this.eventHandlers[eventType](...Object.values(data));
            subject.next(event);
          });
        });
      }
    };

    const onDropped = (subscription, reason, error) => {
      Logger.error(error, reason, subscription);
    };

    try {
      if (!Array.isArray(this.category)) {
        await this.eventStore.client.subscribeToStream(streamName, onEvent, onDropped, this.resolveLinkTos);
      }
    } catch (err) {
      Logger.error(err, err, 'EventStore');
    }
  }

  setEventHandlers(eventHandlers) {
    this.eventHandlers = eventHandlers;
  }
}
