module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/__helpers',
    '/hello-world/',
  ],
  collectCoverage: true,
  coverageReporters: ['lcov'],
  collectCoverageFrom: ['src/**/*.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/node_nodules/',
    '<rootDir>/lib/',
    '<rootDir>/coverage/',
    '<rootDir>/hello-world/',
  ],
};
