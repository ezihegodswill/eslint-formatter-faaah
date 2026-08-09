import { RuleModule } from '@typescript-eslint/utils/ts-eslint';

export const RULE_NAME = 'no-console-faaah';

export type MessageIds = 'noConsoleFaaah';
export type Options = [];

export const noConsoleFaaahRule: RuleModule<MessageIds, Options> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow console.log statements and trigger dynamic FAAAH audio penalty scaled by error count.',
    },
    schema: [],
    messages: {
      noConsoleFaaah:
        "Unexpected console.log statement found! Penalizing codebase with dynamic 'faaah' audio scaling.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'console' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'log'
        ) {
          context.report({
            node,
            messageId: 'noConsoleFaaah',
          });
        }
      },
    };
  },
};
