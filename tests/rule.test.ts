import { describe, it } from 'bun:test';
import { RuleTester } from 'eslint';
import { noConsoleFaaahRule } from '../src/rules/no-console-faaah.js';

// Configure RuleTester to use Bun's global test functions
(RuleTester as any).describe = describe;
(RuleTester as any).it = it;

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('no-console-faaah', noConsoleFaaahRule as any, {
  valid: [
    { code: 'console.error("This is an error");' },
    { code: 'console.warn("This is a warning");' },
    { code: 'const logger = { log: () => {} }; logger.log();' },
    { code: 'function customLog() { return 42; }' },
  ],
  invalid: [
    {
      code: 'console.log("Hello world");',
      errors: [
        {
          message: "Unexpected console.log statement found! Penalizing codebase with dynamic 'faaah' audio scaling.",
        },
      ],
    },
    {
      code: 'function debug() { console.log("Debugging..."); }',
      errors: [
        {
          message: "Unexpected console.log statement found! Penalizing codebase with dynamic 'faaah' audio scaling.",
        },
      ],
    },
  ],
});
