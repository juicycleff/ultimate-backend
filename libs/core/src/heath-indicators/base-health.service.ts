import {
  DNSHealthIndicator,
  MicroserviceHealthIndicator,
  TerminusEndpoint,
  TerminusModuleOptions,
  TerminusOptionsFactory,
} from '@nestjs/terminus';
import { Injectable, Logger } from '@nestjs/common';
import { MongoHealthIndicator } from '../';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class BaseHealthService implements TerminusOptionsFactory {
  private dns: DNSHealthIndicator;
  private ms: MicroserviceHealthIndicator;
  private mongo: MongoHealthIndicator;
  private options: BaseHealthServiceOptions;
  private logger = new Logger(this.constructor.name);

  constructor(
    dns: DNSHealthIndicator,
    ms: MicroserviceHealthIndicator,
    mongo: MongoHealthIndicator,
    options?: BaseHealthServiceOptions,
  ) {
    this.dns = dns;
    this.ms = ms;
    this.mongo = mongo;
    this.options = options;
  }

  async createTerminusOptions(): Promise<TerminusModuleOptions> {
    try {
      const healths = [];

      for (const s of this.options.services) {
        const res = async () =>
          this.ms.pingCheck('tcp', {
            options: {
              host: s.host,
              port: s.port,
              name: s.name,
            },
            // @ts-ignore
            transport: s.transport || Transport.TCP,
          });
        healths.push(res);
      }

      const healthEndpoint: TerminusEndpoint = {
        url: '/health',
        healthIndicators: [
          ...healths,
          async () => this.mongo.pingCheck('mongo'),
        ],
      };
      return {
        endpoints: [healthEndpoint],
      };
    } catch (e) {
      this.logger.error(e);

      const healthEndpoint: TerminusEndpoint = {
        url: '/health',
        healthIndicators: [
          async () => this.dns.pingCheck('google', 'https://google.com'),
        ],
      };

      return {
        endpoints: [healthEndpoint],
      };
    }
  }
}

interface BaseHealthServiceOptions {
  services: ServiceOptions[];
}

interface ServiceOptions {
  port?: number;
  host?: string;
  name?: string;
  transport?: Transport;
}
