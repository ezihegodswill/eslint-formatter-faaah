import { noConsoleFaaahRule } from './rules/no-console-faaah.js';
import faaahFormatter from './formatters/faaah.js';

const meta = {
  name: '@ezihegodswill/eslint-plugin-console-faaah',
  version: '0.1.0',
};

export const rules = {
  'no-console-faaah': noConsoleFaaahRule,
};

export const formatters = {
  faaah: faaahFormatter,
};

export const configs = {
  recommended: {
    plugins: ['@ezihegodswill/console-faaah'],
    rules: {
      '@ezihegodswill/console-faaah/no-console-faaah': 'error',
    },
  },
  'flat/recommended': {
    plugins: {
      '@ezihegodswill/console-faaah': { meta, rules, formatters },
    },
    rules: {
      '@ezihegodswill/console-faaah/no-console-faaah': 'error',
    },
  },
};

const plugin = {
  meta,
  rules,
  formatters,
  configs,
};

export default plugin;

