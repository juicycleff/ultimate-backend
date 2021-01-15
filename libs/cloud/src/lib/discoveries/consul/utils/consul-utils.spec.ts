import { ConsulUtils } from './consul-utils';

describe('Consul Utils', () => {
  it('can get meta data', async () => {
    const result = ConsulUtils.getMetadata(['svc = trump']);
    expect(result).toBeDefined();
  });
});
