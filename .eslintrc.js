module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  ignorePatterns: ['__test__/*', '__tests__/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', '@typescript-eslint/tslint', 'prettier', 'import'],
  rules: {
    '@typescript-eslint/indent': 'off',
    'max-len': ['error', { code: 120 }],
    'import/no-unresolved': 'off',
    'prettier/prettier': 'error',
    'import/extensions': 'off',
  },
  settings: {},
};
