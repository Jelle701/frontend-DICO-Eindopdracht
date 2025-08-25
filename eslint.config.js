/**
 * @file eslint.config.js
 * @description This file contains the configuration for ESLint, the static code analysis tool used to find and fix
 * problems in the JavaScript/React code. It defines the rules for code quality, style, and best practices.
 *
 * @module EslintConfig
 */
import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    // Ignores the build output directory from linting.
    ignores: ['dist/'],
  },
  {
    // Specifies that this configuration applies to all .js and .jsx files.
    files: ['**/*.{js,jsx}'],
    plugins: {
      // Core React linting rules.
      react,
      // Enforces the Rules of Hooks.
      'react-hooks': reactHooks,
      // Validates that components are valid targets for Fast Refresh.
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        // Enables all standard browser global variables.
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          // Enables parsing of JSX.
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    rules: {
      // Inherits all recommended rules from ESLint, React, and React Hooks.
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Enforces that only components are exported from files, which is required for Fast Refresh.
      'react-refresh/only-export-components': 'warn',
      // Allows unused variables if they start with an uppercase letter or underscore (common for placeholder parameters).
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Disables the rule that requires React to be in scope (not needed with modern JSX transform).
      'react/react-in-jsx-scope': 'off',
      // Disables the requirement for prop-types validation, as this project may rely on other forms of type checking (e.g., manual validation or future TypeScript).
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        // Automatically detects the React version to use for linting rules.
        version: 'detect',
      },
    },
  },
];
