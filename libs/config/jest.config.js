// eslint-disable-next-line no-undef
module.exports = {
  displayName: 'config',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/config',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
