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
    { code: 'function test(console: any) { console.log("allowed"); }' },
    { code: 'const console = { log: (msg: string) => msg }; console.log("custom");' },
    { code: 'const fn = (console: any) => console.log("param");' },
    { code: 'try {} catch (console: any) { console.log("error"); }' },
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
    {
      code: 'if (cond) console.log("x");',
      output: 'if (cond) {}',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: 'while (cond) console.log("x");',
      output: 'while (cond) {}',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: 'for (let i = 0; i < 10; i++) console.log(i);',
      output: 'for (let i = 0; i < 10; i++) {}',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: 'do console.log("x"); while (cond);',
      output: 'do {} while (cond);',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: 'const x = console.log();',
      output: 'const x = void 0;',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: 'const f = () => console.log();',
      output: 'const f = () => void 0;',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: '(console.log(), 42);',
      output: '(void 0, 42);',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
    {
      code: 'function res() { return console.log(); }',
      output: 'function res() { return void 0; }',
      errors: [{ messageId: 'noConsoleFaaah' }],
    },
  ],
});



