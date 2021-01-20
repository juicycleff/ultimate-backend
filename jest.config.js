import 'jest-ts-auto-mock';

module.exports = {
  projects: [
    '<rootDir>/libs/cloud',
    '<rootDir>/libs/proto-schema',
    '<rootDir>/libs/grpc',
    '<rootDir>/libs/core',
    '<rootDir>/libs/common',
    '<rootDir>/libs/loadbalancer',
    '<rootDir>/libs/permissions',
    '<rootDir>/libs/cli',
    '<rootDir>/apps/example',
    '<rootDir>/apps/adv-example',
    '<rootDir>/libs/consul',
  ],
};
