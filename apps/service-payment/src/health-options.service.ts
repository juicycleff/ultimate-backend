import { Injectable } from '@nestjs/common';
import { BaseHealthService, MongoHealthIndicator } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { DNSHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class HealthOptionsService extends BaseHealthService {
  constructor(
    private readonly dnsN: DNSHealthIndicator,
    private readonly msN: MicroserviceHealthIndicator,
    private readonly mongoN: MongoHealthIndicator,
  ) {
    super(dnsN, msN, mongoN, {
      services: [
        {
          host: 'localhost',
          name: 'microservice',
          port: AppConfig.services?.plan?.grpcPort || 7500,
          transport: Transport.TCP,
        },
      ],
    });
  }
}
