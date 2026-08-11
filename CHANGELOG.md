# @ezihegodswill/eslint-plugin-console-faaah

## 0.1.2

### Patch Changes

- 136bd11: - Fix missing `dist/formatters/faaah.js` build artifact by including `./src/formatters/faaah.ts` in build entrypoints.
  - Prevent destructive auto-fixes on single-statement bodies and expression contexts.
  - Perform scope analysis to ignore local `console` parameters and variables.

## 0.1.1

### Patch Changes

- 03601db: Initial release of `@ezihegodswill/eslint-plugin-console-faaah` featuring `no-console-faaah` AST rule with auto-fixing and method filtering, custom `faaah` audio formatter, standalone `console-faaah` CLI binary, and zero-dependency SoundPlayer engine.
