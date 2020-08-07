import { Transport } from '@nestjs/microservices';
import {
  MicroserviceHealthIndicator,
  TerminusModuleOptions,
} from '@nestjs/terminus';

const getMicroserviceTerminusOptions = (
  microservice: MicroserviceHealthIndicator,
): TerminusModuleOptions => ({
  endpoints: [
    {
      url: '/health',
      healthIndicators: [
        async () =>
          microservice.pingCheck('tcp', {
            transport: Transport.TCP,
            options: { host: 'localhost', port: 8889 },
          }),
        async () =>
          microservice.pingCheck('redis', {
            transport: Transport.REDIS,
            options: {
              url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            },
          }),
      ],
    },
  ],
});
