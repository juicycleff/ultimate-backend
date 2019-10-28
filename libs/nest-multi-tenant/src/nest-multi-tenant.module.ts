import {
  Module,
} from '@nestjs/common';
import { NestMultiTenantService } from './nest-multi-tenant.service';

@Module({
  providers: [NestMultiTenantService],
  exports: [NestMultiTenantService],
})
export class NestMultiTenantModule {}
