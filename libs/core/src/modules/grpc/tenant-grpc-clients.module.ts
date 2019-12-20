import { Module } from '@nestjs/common';
import { TenantGuardService } from '../../services/tenant-guard.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TENANT_SERVICE } from '@graphqlcqrs/core';
import { AppConfig } from '@graphqlcqrs/common/services/yaml.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([{ name: TENANT_SERVICE, transport: Transport.GRPC, options: {
        package: 'tenant',
        url: `localhost:${AppConfig.services?.tenant?.grpcPort || 7200}`,
        protoPath: join('proto/tenant.proto'),
      },
    }]),
  ],
  providers: [TenantGuardService],
  exports: [TenantGuardService],
})
export class TenantGrpcClientsModule {}
