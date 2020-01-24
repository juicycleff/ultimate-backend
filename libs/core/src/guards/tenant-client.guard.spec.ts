import { TenantClientGuard } from './tenant-client.guard';

describe('TenantGuard', () => {
  it('should be defined', () => {
    expect(new TenantClientGuard()).toBeDefined();
  });
});
