/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/src/*.{js,ts}', '!/node_modules/'],
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
  testRegex: '(/tests/.*|\\.(test))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePathIgnorePatterns: ['tests/wares/rate-limit/rate-limit.test.ts', 'examples']
}
