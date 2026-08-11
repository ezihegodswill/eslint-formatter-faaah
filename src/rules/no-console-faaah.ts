import { RuleModule } from '@typescript-eslint/utils/ts-eslint';

export const RULE_NAME = 'no-console-faaah';

export type MessageIds = 'noConsoleFaaah';
export type Options = [{ methods?: string[]; ignore?: string[] }?];

export const noConsoleFaaahRule: RuleModule<MessageIds, Options> = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Disallow all console statements and trigger audio sound penalty.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          methods: {
            type: 'array',
            items: { type: 'string' },
          },
          ignore: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noConsoleFaaah:
        "Unexpected console statement found! Penalizing codebase with 'faaah' audio effect.",
    },
  },
  defaultOptions: [{}],
  create(context) {
    const config = context.options[0] || {};
    const methods = config.methods;
    const ignore = config.ignore;

    function getPropertyName(node: any): string | null {
      if (!node.computed && node.property.type === 'Identifier') {
        return node.property.name;
      }
      if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string') {
        return node.property.value;
      }
      return null;
    }

    function isGlobalConsole(node: any): boolean {
      let scope = context.sourceCode ? context.sourceCode.getScope(node) : (context as any).getScope();
      while (scope) {
        const variable = scope.set.get('console');
        if (variable) {
          if (variable.defs && variable.defs.length > 0) {
            return false;
          }
        }
        scope = scope.upper;
      }
      return true;
    }

    return {
      CallExpression(node) {
        const callee = node.callee;
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'console' &&
          isGlobalConsole(callee.object)
        ) {
          const propName = getPropertyName(callee);
          if (propName) {
            if (ignore && ignore.includes(propName)) {
              return;
            }
            const shouldReport = methods ? methods.includes(propName) : true;
            if (shouldReport) {
              context.report({
                node,
                messageId: 'noConsoleFaaah',
                fix(fixer) {
                  const targetNode =
                    node.parent && node.parent.type === 'ExpressionStatement'
                      ? node.parent
                      : node;
                  return fixer.remove(targetNode as any);
                },
              });
            }
          }
        }
      },
    };
  },
};



