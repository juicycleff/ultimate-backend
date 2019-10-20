import { Response } from '@nestjs/common';
import { createNamespace } from 'continuation-local-storage';
import * as vhost from 'vhost';
import { CONTINUATION_KEY } from '../tenant.constant';
import { MultiTenancyConfig, TenantInfo } from '../interfaces';
import { TenantResolverType } from '../tenant.enum';

export const tenantNamespace = createNamespace(CONTINUATION_KEY);

export function enableMultiTenancy(option: MultiTenancyConfig) {

  if (option.resolverType === TenantResolverType.Domain) {
    return vhost('*.localhost:9900', (req, res, next) => {
      // for match of "foo.bar.example.com:8080" against "*.*.example.com":
      console.dir(req.vhost.host); // => 'foo.bar.example.com:8080'
      console.dir(req.vhost.hostname); // => 'foo.bar.example.com'
      console.dir(req.vhost.length); // => 2
      console.dir(req.vhost[0]); // => 'foo'
      console.dir(req.vhost[1]); // => 'bar'

      if (!option.enabled) {
        next();
      }

      const tenantInfo: TenantInfo = {};

      if (option.resolverType === TenantResolverType.Domain && req.subdomains.length) {
        tenantInfo.tenant = req.subdomains[0];
        tenantNamespace.run(() => {
          tenantNamespace.set('tenant', tenantInfo);
          next();
        });
      }
    });
  }
  return (req, res: Response, next) => {
    if (!option.enabled) {
      next();
    }

    const tenant = {
      id: null,
    };

    if (option.resolverType === TenantResolverType.Cookie) {
      // tenant.id = req.cookie
    }

    console.log(req.cookies);
    next();
  };
}
