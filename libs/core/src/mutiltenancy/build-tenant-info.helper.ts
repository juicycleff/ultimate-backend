import { MultiTenancyConfig, TenantInfo } from './interface';
import { IRequest } from '@ultimatebackend/common';

export class BuildTenantInfoHelper {
  private addOptions: boolean = true;

  constructor(
    private readonly req: IRequest,
    private readonly options: MultiTenancyConfig,
  ) {}

  public withOptions(addOptions: boolean) {
    this.addOptions = addOptions;
    return this;
  }

  private makeTenantInfo(
    tenantId: string,
    config: MultiTenancyConfig,
    accessToken: any = null,
  ): TenantInfo {
    return {
      tenantId,
      config,
      accessToken,
    };
  }

  private init(): TenantInfo {
    let accessToken = {};
    let tenantId = '';

    if (this.options.tenantResolver.resolverType === 'Domain') {
      tenantId = this.req.vhost.length && this.req.vhost[0];

      if (this.options.tenantResolver.requiresToken) {
        const headerKeys = this.options.tenantResolver.headerKeys;
        accessToken = {
          key: this.req.headers[headerKeys.apiKey],
        };
      }
    } else if (this.options.tenantResolver.resolverType === 'Header') {
      const headerKeys = this.options.tenantResolver.headerKeys;
      tenantId = this.req.headers[headerKeys.tenant] as string;

      if (this.options.tenantResolver.requiresToken) {
        accessToken = {
          key: this.req.headers[headerKeys.apiKey],
        };
      }
    } else if (this.options.tenantResolver.resolverType === 'Query') {
      const queryKeys = this.options.tenantResolver.queryKeys;
      tenantId = this.req.query[queryKeys.tenant].toString();

      if (this.options.tenantResolver.requiresToken) {
        accessToken = {
          key: this.req.query[queryKeys.apiKey],
        };
      }
    } else if (this.options.tenantResolver.resolverType === 'Cookie') {
      const cookieKeys = this.options.tenantResolver.cookieKeys;
      tenantId =
        this.req.signedCookies[cookieKeys.tenant] ||
        this.req.cookies[cookieKeys.tenant];

      if (this.options.tenantResolver.requiresToken) {
        accessToken = {
          key:
            this.req.signedCookies[cookieKeys.apiKey] ||
            this.req.cookies[cookieKeys.apiKey],
        };
      }
    } else if (this.options.tenantResolver.resolverType === 'Params') {
      // const paramKeys = this.options.tenantResolver.paramKeys;
      const headerKeys = this.options.tenantResolver.headerKeys;
      const path = this.req.path;
      try {
        tenantId = path.split('/')[1];

        if (this.options.tenantResolver.requiresToken) {
          accessToken = {
            key: this.req.headers[headerKeys.apiKey],
          };
        }
      } catch (e) {
        // this.logger.error(e);
      }
    }

    return this.makeTenantInfo(
      tenantId,
      this.addOptions ? this.options : null,
      accessToken,
    );
  }

  build(): TenantInfo {
    return this.init();
  }
}
