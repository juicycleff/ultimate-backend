const NO_COVERAGE = process.env.NO_COVERAGE === '1';
const CLEAR_CONSOLE = process.env.CLEAR_CONSOLE === '1';

const notice = () => console.log('Using Jest config from `jest.config.js`');

if (CLEAR_CONSOLE) {
  // eslint-disable-next-line global-require,import/no-unresolved
  require('clear')();
  console.log();
  notice();
  console.log('Clearing console due to CLEAR_CONSOLE=1');
} else {
  notice();
}

if (NO_COVERAGE) {
  console.log('Coverage not collected due to NO_COVERAGE=1');
}

module.exports = {
  displayName: 'cloud',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
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
