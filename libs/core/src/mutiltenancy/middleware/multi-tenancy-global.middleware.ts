import * as vhost from 'vhost';
import { MultiTenancyConfig } from '../interface';
import { IRequest } from '@ultimatebackend/common';
import { BuildTenantInfoHelper } from '../';

export function enableMultiTenancy(option: MultiTenancyConfig) {
  if (option.tenantResolver.resolverType === 'Domain') {
    return vhost('*.localhost', (req: IRequest, res, next) => {
      // @ts-ignore
      req.tenantInfoOption = option;
      if (!option.enabled) {
        next();
      }

      if (req.vhost.length) {
        req.tenantInfo = new BuildTenantInfoHelper(req, option)
          .withOptions(true)
          .build();
        next();
      } else {
        next();
      }
    });
  }

  return (req: IRequest, res: Response, next) => {
    if (!option.enabled) {
      next();
    }

    req.tenantInfo = new BuildTenantInfoHelper(req, option)
      .withOptions(true)
      .build();
    next();
  };
}
