import eslintjson from '@eslint/json';
import eslinttypescript from 'typescript-eslint';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import { Linter } from 'eslint';

const ignoresConfig: Linter.Config = {
  ignores: ['build/**', 'dist/**', 'files/**', 'node_modules/**', 'package-lock.json']
};

const typescriptCustomConfig: Linter.Config = {
  files: ['**/*.ts'],
  languageOptions: { parser: eslinttypescript.parser, sourceType: 'module' }
};

const prettierCustomConfig: Linter.Config = {
  rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }] }
};

export default defineConfig([
  ignoresConfig,
  ...eslinttypescript.configs.recommended,
  typescriptCustomConfig,
  eslintjson.configs.recommended,
  prettierRecommendedConfig,
  prettierCustomConfig
]);
