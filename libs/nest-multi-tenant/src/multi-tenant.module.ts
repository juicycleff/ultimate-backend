import {
  Module,
} from '@nestjs/common';
import { MultiTenantService } from './multi-tenant.service';

@Module({
  providers: [MultiTenantService],
  exports: [MultiTenantService],
})
export class MultiTenantModule {}
