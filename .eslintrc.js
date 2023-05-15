module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:prettier/recommended'],
  overrides: [
    {
      files: ['**/*.cy.ts'], // Update the file pattern to match Cypress files
      env: {
        mocha: true,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': [
      'error',
      { singleQuote: true },
      {
        usePrettierrc: true,
      },
    ],
    'no-empty': ['error'],
    'no-irregular-whitespace': ['error'],
  },
};
