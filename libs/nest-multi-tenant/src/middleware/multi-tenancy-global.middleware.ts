import { Response } from '@nestjs/common';
import { createNamespace } from 'continuation-local-storage';
import * as vhost from 'vhost';
import { CONTINUATION_KEY } from '../tenant.constant';
import { MultiTenancyConfig, TenantInfo } from '../interfaces';
import { TenantResolverType } from '../tenant.enum';

export const tenantNamespace = createNamespace(CONTINUATION_KEY);

export function enableMultiTenancy(option: MultiTenancyConfig) {

  if (option.resolverType === TenantResolverType.Domain) {
    return vhost('*.localhost', (req, res, next) => {
      if (!option.enabled) {
        next();
      }

      if (req.vhost.length) {
        const tenantInfo: TenantInfo = {
          tenant: req.vhost.length && req.vhost[0],
          config: {
            ...option,
          },
        } as TenantInfo;
        req.tenantInfo = tenantInfo;
        next();
      } else {
        next();
      }
    });
  }

  return (req, res: Response, next) => {
    if (!option.enabled) {
      next();
    }
    console.log('Jumpp3');

    const tenant = {
      id: null,
    };

    if (option.resolverType === TenantResolverType.Cookie) {
      // tenant.id = req.cookie
      console.log(req.cookies);
    }
    next();
  };
}
