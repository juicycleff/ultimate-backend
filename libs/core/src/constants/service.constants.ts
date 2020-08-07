const baseUrl = process.cwd() + '/dist/libs/proto-schema/';

export const SERVICE_LIST = {
  role: {
    package: 'io.ultimatebackend.srv.role',
    consulName: 'io.ultimatebackend.srv.role',
    service: 'RoleService',
    protoPath: baseUrl + 'proto/role.proto',
  },
  access: {
    package: 'io.ultimatebackend.srv.access',
    consulName: 'io.ultimatebackend.srv.access',
    service: 'AccessService',
    protoPath: baseUrl + 'proto/access.proto',
  },
  webhook: {
    package: 'io.ultimatebackend.srv.webhook',
    consulName: 'io.ultimatebackend.srv.webhook',
    service: 'WebhookService',
    protoPath: baseUrl + 'proto/webhook.proto',
  },
  billing: {
    package: 'io.ultimatebackend.srv.billing',
    consulName: 'io.ultimatebackend.srv.billing',
    service: 'BillingService',
    protoPath: baseUrl + 'proto/billing.proto',
  },
  tenant: {
    package: 'io.ultimatebackend.srv.tenant',
    consulName: 'io.ultimatebackend.srv.tenant',
    service: 'TenantService',
    protoPath: baseUrl + 'proto/tenant.proto',
  },
  account: {
    package: 'io.ultimatebackend.srv.account',
    consulName: 'io.ultimatebackend.srv.account',
    service: 'AccountService',
    protoPath: baseUrl + 'proto/account.proto',
  },
  project: {
    package: 'io.ultimatebackend.srv.project',
    consulName: 'io.ultimatebackend.srv.project',
    service: 'ProjectService',
    protoPath: baseUrl + 'proto/project.proto',
  },
  admin: {
    consulName: 'io.ultimatebackend.api.admin',
  },
};
