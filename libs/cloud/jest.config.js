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
  displayName: 'cloud',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      compiler: 'ttypescript',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: NO_COVERAGE === true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: '../../coverage/libs/cloud',
};
