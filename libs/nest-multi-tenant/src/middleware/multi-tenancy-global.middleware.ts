import * as vhost from 'vhost';
import { MultiTenancyConfig, TenantInfo } from '../interfaces';
import { IRequest } from '@graphqlcqrs/common';

export function enableMultiTenancy(option: MultiTenancyConfig) {

  if (option.tenantResolver.resolverType === 'Domain') {
    return vhost('*.localhost', (req: IRequest, res, next) => {
      if (!option.enabled) {
        next();
      }

      if (req.vhost.length) {
        let tenantInfo: TenantInfo;
        const tenantName = req.vhost.length && req.vhost[0];
        let accessToken = {};

        if (option.tenantResolver.requiresToken) {
          if (option.tenantResolver.resolverType === 'Domain') {
            const headerKeys = option.tenantResolver.headerKeys;
            accessToken = {
              key: req.headers[headerKeys.key],
              secret: req.headers[headerKeys.secret],
            };
          }
        }
        tenantInfo = makeTenantInfo(tenantName, option, accessToken);
        req.tenantInfo = tenantInfo;

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

    let tenantInfo: TenantInfo;

    if (option.tenantResolver.resolverType === 'Header') {
      const headerKeys = option.tenantResolver.headerKeys;

      const tenantName = req.headers[headerKeys.tenant] as string;
      let accessToken = {};

      if (option.tenantResolver.requiresToken) {
        accessToken = {
          key: req.headers[headerKeys.key],
          secret: req.headers[headerKeys.secret],
        };
      }
      tenantInfo = makeTenantInfo(tenantName, option, accessToken);

    } else if (option.tenantResolver.resolverType === 'Params') {
      const paramKeys = option.tenantResolver.paramKeys;
      const headerKeys = option.tenantResolver.headerKeys;

      const tenantName = req.params[paramKeys.tenant];
      let accessToken = {};

      if (option.tenantResolver.requiresToken) {
        accessToken = {
          key: req.headers[headerKeys.key],
          secret: req.headers[headerKeys.secret],
        };
      }
      tenantInfo = makeTenantInfo(tenantName, option, accessToken);

    } else if (option.tenantResolver.resolverType === 'Query') {
      const queryKeys = option.tenantResolver.queryKeys;

      const tenantName = req.query[queryKeys.tenant];
      let accessToken = {};

      if (option.tenantResolver.requiresToken) {
        accessToken = {
          key: req.query[queryKeys.key],
          secret: req.query[queryKeys.secret],
        };
      }
      tenantInfo = makeTenantInfo(tenantName, option, accessToken);

    } else if (option.tenantResolver.resolverType === 'Cookie') {
      const cookieKeys = option.tenantResolver.cookieKeys;

      const tenantName =  req.signedCookies[cookieKeys.tenant] || req.cookies[cookieKeys.tenant];
      let accessToken = {};

      if (option.tenantResolver.requiresToken) {
        accessToken = {
          key: req.signedCookies[cookieKeys.key] || req.cookies[cookieKeys.key],
          secret: req.signedCookies[cookieKeys.secret] || req.cookies[cookieKeys.secret],
        };
      }
      tenantInfo = makeTenantInfo(tenantName, option, accessToken);
    }

    req.tenantInfo = tenantInfo;

    next();
  };
}

function makeTenantInfo(
  tenant: string, config: MultiTenancyConfig,
  accessToken: any = null, connectionString: string = null,
): TenantInfo {
  return {
    tenant,
    config,
    accessToken,
    connectionString,
  };
}
