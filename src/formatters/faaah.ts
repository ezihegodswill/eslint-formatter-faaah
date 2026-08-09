import type { ESLint } from 'eslint';
import { getAudioSelectionForSeverity, playAudioFile } from '../audio/player.js';

/**
 * Custom ESLint Formatter: 'faaah'
 * Aggregates error/warning severity counts, plays corresponding MP3 audio effect,
 * and formats CLI output with ANSI styling.
 */
export default async function faaahFormatter(
  results: ESLint.LintResult[],
  _context?: ESLint.LintResultData
): Promise<string> {
  let totalErrors = 0;
  let totalWarnings = 0;

  const lines: string[] = [];

  for (const result of results) {
    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;

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
  if (totalErrors > 0 || totalWarnings > 0) {
    const errText = `${totalErrors} ${totalErrors === 1 ? 'error' : 'errors'}`;
    const warnText = `${totalWarnings} ${totalWarnings === 1 ? 'warning' : 'warnings'}`;
    lines.push(`\x1b[31m\x1b[1m✖ ${totalErrors + totalWarnings} problems (${errText}, ${warnText})\x1b[0m`);
  }

  // Select sound effect based on severity
  const audioSelection = getAudioSelectionForSeverity(totalErrors, totalWarnings);

  // Trigger audio playback side effect
  playAudioFile(audioSelection.filePath);

  // Format ANSI status card
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const red = '\x1b[31m';
  const bold = '\x1b[1m';
  const reset = '\x1b[0m';

  let borderColor = green;
  let statusTitle = '  ✨ CLEAN CODEBASE - NO ISSUES FOUND!';
  let soundIcon = '🎉';

  if (audioSelection.severityType === 'error') {
    borderColor = red;
    statusTitle = '  🚨 CONSOLE ERROR(S) DETECTED!       ';
    soundIcon = '💥';
  } else if (audioSelection.severityType === 'warning') {
    borderColor = yellow;
    statusTitle = '  ⚠️  CONSOLE WARNING(S) DETECTED!     ';
    soundIcon = '🔊';
  }

  const audioSummaryBanner = [
    '',
    `${borderColor}${bold}┌──────────────────────────────────────────────────────────┐${reset}`,
    `${borderColor}${bold}│ ${statusTitle}          │${reset}`,
    `${borderColor}${bold}├──────────────────────────────────────────────────────────┤${reset}`,
    `${borderColor}${bold}│${reset}  Total Errors       : ${bold}${totalErrors}${reset}`,
    `${borderColor}${bold}│${reset}  Total Warnings     : ${bold}${totalWarnings}${reset}`,
    `${borderColor}${bold}│${reset}  Active Sound       : ${bold}${audioSelection.name} ${soundIcon}${reset}`,
    `${borderColor}${bold}└──────────────────────────────────────────────────────────┘${reset}`,
    '',
  ].join('\n');

  const body = lines.join('\n');
  return body + audioSummaryBanner;
}
