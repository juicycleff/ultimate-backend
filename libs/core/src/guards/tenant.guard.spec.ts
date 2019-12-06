import { TenantGuard } from './tenant.guard';

describe('TenantGuard', () => {
  it('should be defined', () => {
    expect(new TenantGuard()).toBeDefined();
  });
});
