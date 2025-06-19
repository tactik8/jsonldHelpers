
export default {
  testEnvironment: 'jsdom',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    window: {},
    crypto: {
      getRandomValues: (array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      }
    }
  },
  setupFiles: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/node_modules/**'
  ],
  moduleNameMapping: {
    '^../src/src/(.*)$': '<rootDir>/src/src/$1'
  }
};
