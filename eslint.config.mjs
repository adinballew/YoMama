import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      react: react,
    },
    rules: {
      'arrow-parens': 0,
      'camelcase': 0,
      'comma-dangle': [2, {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'functions': 'ignore',
      }],
      'import/no-import-module-exports': 0,
      'import/no-relative-packages': 0,
      'import/order': ['error', {
        'groups': [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
          ['object', 'type'],
        ],
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        'newlines-between': 'always',
      }],
      'indent': ['error', 'tab'],
      'max-len': [2, {
        'code': 140,
        'ignoreComments': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreTrailingComments': true,
        'ignoreUrls': true,
      }],
      'newline-per-chained-call': 0,
      'no-console': 1,
      'no-param-reassign': 0,
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
      'object-curly-newline': 0,
      'object-curly-spacing': [2, 'always'],
      'semi': [2, 'always'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
];

