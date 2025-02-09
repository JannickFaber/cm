module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular'
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/+(*.)+(spec|test).+(ts|js)?(x)',
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
};
