import type { ESLint } from "eslint";
import { ESLint as ESLintClass } from "eslint";
import { playAudio } from "@ezihegodswill/native-audio-player";
import path from "node:path";

let cachedStylishFormatter: ESLint.Formatter | null = null;

export const SOUND_PATH = path.resolve(
  import.meta.dirname,
  "./assets/faaah.wav",
);

export function isSoundDisabled(): boolean {
  const ciEnv = process.env.CI;
  const soundDisabledEnv = process.env.DISABLE_SOUND;
  if (
    ciEnv === "true" ||
    ciEnv === "1" ||
    soundDisabledEnv === "true" ||
    soundDisabledEnv === "1"
  ) {
    return true;
  } else {
    return false;
  }
}

export default async function faaahFormatter(
  results: ESLint.LintResult[],
  context?: ESLint.LintResultData,
): Promise<string> {
  const totalErrors = results.reduce((acc, r) => acc + r.errorCount, 0);
  const totalWarnings = results.reduce((acc, r) => acc + r.warningCount, 0);
  const totalProblems = totalErrors + totalWarnings;

  if (totalProblems > 0 && !isSoundDisabled()) {
    try {
      playAudio(SOUND_PATH);
    } catch {
      // Silently catch audio errors so lint execution is never disrupted
    }
  }

  // Load and cache ESLint's default 'stylish' formatter
  if (!cachedStylishFormatter) {
    const eslintInstance = new ESLintClass();
    cachedStylishFormatter = await eslintInstance.loadFormatter("stylish");
  }

  return cachedStylishFormatter.format(results, context);
}
