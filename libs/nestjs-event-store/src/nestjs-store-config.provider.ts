import { IEventStoreConnectConfig } from './contract/event-store-connect-config.interface';

export class NestStoreConfigProvider {
  private readonly esConfig: IEventStoreConnectConfig;
  constructor(option: IEventStoreConnectConfig) {
    this.esConfig = option;
  }

  get eventSourceConfig(): IEventStoreConnectConfig {
    return this.esConfig;
  }
}
