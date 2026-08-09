import { describe, it } from 'bun:test';
import { RuleTester } from 'eslint';
import { noConsoleFaaahRule } from '../src/rules/no-console-faaah.js';

// Configure RuleTester to use Bun's global test functions
(RuleTester as any).describe = describe;
(RuleTester as any).it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
  },
} as any);

ruleTester.run('no-console-faaah', noConsoleFaaahRule as any, {
  valid: [
    { code: 'const logger = { log: () => {} }; logger.log();' },
    { code: 'function customLog() { return 42; }' },
    {
      code: 'console.error("This is allowed when filtered");',
      options: [{ methods: ['log', 'warn'] }],
    },
    {
      code: 'console.trace("This trace is ignored");',
      options: [{ ignore: ['trace'] }],
    },
  ],
  invalid: [
    {
      code: 'console.log("Hello world");',
      output: '',
      errors: [
        {
          messageId: 'noConsoleFaaah',
        },
      ],
    },
    {
      code: 'console.error("Error statement");',
      output: '',
      errors: [
        {
          messageId: 'noConsoleFaaah',
        },
      ],
    },
    {
      code: 'console.warn("Warning statement");',
      output: '',
      errors: [
        {
          messageId: 'noConsoleFaaah',
        },
      ],
    },
    {
      code: 'console["info"]("Computed info statement");',
      output: '',
      errors: [
        {
          messageId: 'noConsoleFaaah',
        },
      ],
    },
    {
      code: 'function debug() { console.log("Debugging..."); }',
      output: 'function debug() {  }',
      errors: [
        {
          messageId: 'noConsoleFaaah',
        },
      ],
    },
  ],
});



