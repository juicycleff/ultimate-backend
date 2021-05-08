import { ConsulUtils } from './consul-utils';

describe('ConsulClient Utils', () => {
  it('can get meta data', async () => {
    const result = ConsulUtils.getMetadata(['svc = trump']);
    expect(result).toBeDefined();
  });
});
