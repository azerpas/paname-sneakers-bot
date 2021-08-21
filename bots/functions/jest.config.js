module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['./node_modules/'],
  moduleNameMapper: {
    "^@src(.*)$": "<rootDir>/src$1",
    "^@bots(.*)$": "<rootDir>/src/bots$1",
    "^@capsolvers(.*)$": "<rootDir>/src/capsolvers$1"
  },
};