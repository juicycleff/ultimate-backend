import 'jest-ts-auto-mock';

module.exports = {
  projects: [
    '<rootDir>/libs/cloud',
    '<rootDir>/libs/proto-schema',
    '<rootDir>/libs/core',
    '<rootDir>/libs/common',
    '<rootDir>/libs/loadbalancer',
    '<rootDir>/libs/permissions',
    '<rootDir>/libs/cli',
    '<rootDir>/apps/example',
    '<rootDir>/apps/adv-example',
    '<rootDir>/libs/consul',
    '<rootDir>/libs/zookeeper',
    '<rootDir>/libs/etcd',
    '<rootDir>/libs/config',
    '<rootDir>/libs/messaging',
    '<rootDir>/libs/redis',
    '<rootDir>/libs/event-store',
    '<rootDir>/libs/couchbase',
    '<rootDir>/libs/client',
    '<rootDir>/libs/brakes',
    '<rootDir>/apps/event-store-example',
  ],
};
