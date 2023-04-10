module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  overrides: [
    {
      files: ['*.astro'],
      extends: ['plugin:astro/recommended'],
      parser: 'astro-eslint-parser',
    },
  ],
  rules: {
    'no-alert': 'error',
    'no-console': 'error',
  },
  extends: ['prettier'],
}
