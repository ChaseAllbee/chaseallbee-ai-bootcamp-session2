module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage/integration',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/integration/**/*.test.js'],
};
