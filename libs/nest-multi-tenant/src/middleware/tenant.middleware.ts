import { Injectable, NestMiddleware } from '@nestjs/common';
import { tenantNamespace } from './multi-tenancy-global.middleware';
import { MultiTenancyConfig, TenantResolverType } from '../';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private option: MultiTenancyConfig;
  constructor(option: MultiTenancyConfig) {
    this.option = option;
  }

  use(req: any, res: any, next: () => void) {
    if (!this.option.enabled) {
      next();
    }

    const tenant = {
      id: null,
    };

    if (this.option.resolverType === TenantResolverType.Domain) {
      tenant.id = req.subdomains.length && req.subdomains[0];
    }

    if (this.option.resolverType === TenantResolverType.Domain && req.subdomains.length) {
      tenant.id = req.subdomains[0];
      tenantNamespace.run(() => {
        tenantNamespace.set('tenant', tenant);
        next();
      });
    }

    if (this.option.resolverType === TenantResolverType.Cookie) {
      // tenant.id = req.cookie
    }
    next();
  }
}
