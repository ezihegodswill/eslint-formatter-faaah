import { describe, it, expect } from 'bun:test';
import type { ESLint } from 'eslint';
import faaahFormatter from '../src/formatters/faaah.js';

describe('Custom faaah ESLint Formatter', () => {
  it('should format clean lint results with None active sound banner', async () => {
    const cleanResults: ESLint.LintResult[] = [
      {
        filePath: '/project/src/index.ts',
        messages: [],
        errorCount: 0,
        warningCount: 0,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
    ];

    const output = await faaahFormatter(cleanResults);
    const plainTextOutput = output.replace(/\u001b\[\d+m/g, '');

    expect(plainTextOutput).toContain('CLEAN CODEBASE - NO ISSUES FOUND!');
    expect(plainTextOutput).toContain('Active Sound       : None');
  });

  it('should format lint results with Faaah Sound banner when issues are detected', async () => {
    const errorResults: ESLint.LintResult[] = [
      {
        filePath: '/project/src/app.ts',
        messages: [
          {
            ruleId: '@ezihegodswill/console-faaah/no-console-faaah',
            severity: 2,
            message: 'Unexpected console statement found!',
            line: 12,
            column: 3,
          },
          {
            ruleId: '@ezihegodswill/console-faaah/no-console-faaah',
            severity: 1,
            message: 'Unexpected console statement found!',
            line: 25,
            column: 5,
          },
        ],
        errorCount: 1,
        warningCount: 1,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
    ];

    const output = await faaahFormatter(errorResults);
    const plainTextOutput = output.replace(/\u001b\[\d+m/g, '');

    expect(plainTextOutput).toContain('CONSOLE STATEMENT(S) DETECTED!');
    expect(plainTextOutput).toContain('Total Problems     : 2');
    expect(plainTextOutput).toContain('Active Sound       : Faaah Sound 💥');
  });
});
