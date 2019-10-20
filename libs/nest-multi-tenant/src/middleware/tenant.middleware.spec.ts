import { TenantMiddleware } from './tenant.middleware';

describe('TenantMiddleware', () => {
  it('should be defined', () => {
    expect(new TenantMiddleware({
      enabled: true,
    })).toBeDefined();
  });
});
