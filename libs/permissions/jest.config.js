const NO_COVERAGE = process.env.NO_COVERAGE === '1';

if (NO_COVERAGE) {
  console.log('Coverage not collected due to NO_COVERAGE=1');
}


module.exports = {
  displayName: 'permissions',
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
  coverageDirectory: '../../coverage/libs/permissions',
};
