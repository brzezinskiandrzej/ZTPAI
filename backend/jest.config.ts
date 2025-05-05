/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
  
    // Patrz w dowolnym miejscu projektu na pliki *.test.ts
    testMatch: ['**/*.test.ts'],
  
    // Lub, jeśli wolisz mieć osobny katalog:
    // roots: ['<rootDir>/tests'],
  
    verbose: false,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testTimeout: 15000,
  };
  
  