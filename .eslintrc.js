module.exports = {
  env: {
    browser: true,
    jest: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-nested-ternary': 'error',
    'prefer-destructuring': 'error',
    '@typescript-eslint/no-unused-vars': 1,
    'no-unused-vars': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'warn',
    'object-curly-newline': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'newline-before-return': 'error',
  },
};
