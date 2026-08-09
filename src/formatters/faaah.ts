import type { ESLint } from 'eslint';
import { getAudioSelection, playAudioFile } from '../audio/player.js';

/**
 * Custom ESLint Formatter: 'faaah'
 * Aggregates total problem counts, plays corresponding 'faaah' audio effect on violations,
 * and formats CLI output with ANSI styling.
 */
export default async function faaahFormatter(
  results: ESLint.LintResult[],
  _context?: ESLint.LintResultData
): Promise<string> {
  let totalProblems = 0;
  const lines: string[] = [];

  for (const result of results) {
    totalProblems += result.errorCount + result.warningCount;

    if (result.messages.length === 0) continue;

    lines.push(`\x1b[4m${result.filePath}\x1b[0m`);

    for (const msg of result.messages) {
      const lineCol = `${msg.line}:${msg.column}`.padEnd(10);
      const isError = msg.severity === 2;
      const badge = isError ? '\x1b[31merror\x1b[0m' : '\x1b[33mwarning\x1b[0m';
      const message = msg.message;
      const rule = msg.ruleId ? `\x1b[90m${msg.ruleId}\x1b[0m` : '';

      lines.push(`  ${lineCol} ${badge}  ${message} ${rule}`);
    }
    lines.push('');
  }

  // Summary line
  if (totalProblems > 0) {
    const issueText = totalProblems === 1 ? 'problem' : 'problems';
    lines.push(`\x1b[31m\x1b[1m✖ ${totalProblems} ${issueText} found\x1b[0m`);
  }

  // Select sound effect based on total problems
  const audioSelection = getAudioSelection(totalProblems);

  // Trigger audio playback side effect if sound is selected
  if (audioSelection.filePath) {
    playAudioFile(audioSelection.filePath);
  }

  // Format ANSI status card
  const green = '\x1b[32m';
  const red = '\x1b[31m';
  const bold = '\x1b[1m';
  const reset = '\x1b[0m';

  const hasIssues = totalProblems > 0;
  const borderColor = hasIssues ? red : green;
  const rawTitle = hasIssues
    ? '  🚨 CONSOLE STATEMENT(S) DETECTED!'
    : '  ✨ CLEAN CODEBASE - NO ISSUES FOUND!';
  const statusTitle = rawTitle.padEnd(54, ' ');
  const activeSoundText = hasIssues ? `${audioSelection.name} 💥` : audioSelection.name;

  const audioSummaryBanner = [
    '',
    `${borderColor}${bold}┌──────────────────────────────────────────────────────────┐${reset}`,
    `${borderColor}${bold}│ ${statusTitle} │${reset}`,
    `${borderColor}${bold}├──────────────────────────────────────────────────────────┤${reset}`,
    `${borderColor}${bold}│${reset}  Total Problems     : ${bold}${totalProblems}${reset}`,
    `${borderColor}${bold}│${reset}  Active Sound       : ${bold}${activeSoundText}${reset}`,
    `${borderColor}${bold}└──────────────────────────────────────────────────────────┘${reset}`,
    '',
  ].join('\n');

  const body = lines.join('\n');
  return body + audioSummaryBanner;
}

