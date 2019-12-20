import { Injectable } from '@nestjs/common';

import { ITenantService } from '@graphqlcqrs/core';

@Injectable()
export class TenantGuardService {

  tenantService: ITenantService;
}
