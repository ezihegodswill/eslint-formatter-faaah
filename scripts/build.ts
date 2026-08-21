import { rmSync, mkdirSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";

// Clean dist directory
rmSync("./dist", { recursive: true, force: true });

// Bundle source code with Bun
const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "none",
  external: ["*"],
});

if (!result.success) {
  console.error("Build failed:", result.logs);
  process.exit(1);
}

// Copy assets cross-platform
mkdirSync("./dist/assets", { recursive: true });
cpSync("./src/assets", "./dist/assets", { recursive: true });

// Emit TypeScript declaration files (.d.ts)
execSync("tsc --emitDeclarationOnly", { stdio: "inherit" });
