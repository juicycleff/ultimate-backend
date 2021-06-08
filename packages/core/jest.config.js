// eslint-disable-next-line no-undef
const NO_COVERAGE = process.env.NO_COVERAGE === '1';
// eslint-disable-next-line no-undef
const CLEAR_CONSOLE = process.env.CLEAR_CONSOLE === '1';

if (CLEAR_CONSOLE) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
  require('clear')();
  // eslint-disable-next-line no-undef
  console.log('Clearing console due to CLEAR_CONSOLE=1');
}

if (NO_COVERAGE) {
  // eslint-disable-next-line no-undef
  console.log('Coverage not collected due to NO_COVERAGE=1');
}

// eslint-disable-next-line no-undef
module.exports = {
  displayName: 'core',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'jest-bench/environment',
  testEnvironmentOptions: {
    testEnvironment: 'node',
  },
  // testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testMatch: [
    '**/__benchmarks__/**/*.[jt]s?(x)',
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '**/?(*.)+(bench|benchmark).[jt]s?(x)',
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/core',
};
