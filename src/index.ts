import { noConsoleFaaahRule } from './rules/no-console-faaah.js';
import faaahFormatter from './formatters/faaah.js';

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
};

const plugin = {
  meta: {
    name: '@ezihegodswill/eslint-plugin-console-faaah',
    version: '0.1.0',
  },
  rules,
  formatters,
  configs,
};

export default plugin;
