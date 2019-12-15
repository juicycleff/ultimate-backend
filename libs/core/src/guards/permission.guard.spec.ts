import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
  it('should be defined', () => {
    expect(new PermissionGuard()).toBeDefined();
  });
});
