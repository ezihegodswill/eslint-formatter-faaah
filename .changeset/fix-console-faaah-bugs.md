---
"@ezihegodswill/eslint-plugin-console-faaah": patch
---

- Fix missing `dist/formatters/faaah.js` build artifact by including `./src/formatters/faaah.ts` in build entrypoints.
- Prevent destructive auto-fixes on single-statement bodies and expression contexts.
- Perform scope analysis to ignore local `console` parameters and variables.
