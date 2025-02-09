module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    transform: {
      '^.+\\.(ts|html)$': 'ts-jest',
    },
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
      '**/+(*.)+(spec|test).+(ts|js)?(x)',
    ],
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  };
  