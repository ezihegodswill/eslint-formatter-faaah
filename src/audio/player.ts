import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface AudioSelection {
  filePath: string;
  name: string;
  severityType: 'clean' | 'warning' | 'error';
}

/**
 * Resolves the absolute path to an audio asset file.
 */
export function resolveAudioPath(filename: string): string {
  const primaryPath = join(__dirname, '../assets/audio', filename);
  if (existsSync(primaryPath)) return primaryPath;

  const fallbackPath = join(process.cwd(), 'assets/audio', filename);
  if (existsSync(fallbackPath)) return fallbackPath;

  return primaryPath;
}

/**
 * Determines the audio file based on lint severity flags.
 * - Clean (0 errors, 0 warnings): anime-wow-sound-effect.mp3
 * - Warning (warning count > 0, 0 errors): fahhh-pump-sound.mp3
 * - Error (error count > 0): nawa-for-yeauhhhh-breauhhhh.mp3
 */
export function getAudioSelectionForSeverity(
  totalErrors: number,
  totalWarnings: number
): AudioSelection {
  if (totalErrors > 0) {
    return {
      filePath: resolveAudioPath('nawa-for-yeauhhhh-breauhhhh.mp3'),
      name: 'Nawa For Yeauuuh Breauuuh',
      severityType: 'error',
    };
  }

  if (totalWarnings > 0) {
    return {
      filePath: resolveAudioPath('fahhh-pump-sound.mp3'),
      name: 'Faaah Pump Sound',
      severityType: 'warning',
    };
  }

  return {
    filePath: resolveAudioPath('anime-wow-sound-effect.mp3'),
    name: 'Anime Wow Sound',
    severityType: 'clean',
  };
}

/**
 * Checks whether audio playback should be muted (e.g. in CI or test environments).
 */
export function isAudioDisabled(): boolean {
  return (
    process.env.FAAAH_DISABLE_AUDIO === 'true' ||
    process.env.FAAAH_DISABLE_AUDIO === '1' ||
    process.env.CI === 'true' ||
    process.env.CI === '1' ||
    process.env.NODE_ENV === 'test'
  );
}

/**
 * Plays an MP3 audio file asynchronously using native OS CLI players.
 */
export function playAudioFile(filePath: string): void {
  if (isAudioDisabled() || !existsSync(filePath)) {
    return;
  }

  const platform = process.platform;
  let command = '';
  let args: string[] = [];

  if (platform === 'darwin') {
    command = 'afplay';
    args = [filePath];
  } else if (platform === 'linux') {
    command = 'mpg123';
    args = ['-q', filePath];
  } else if (platform === 'win32') {
    command = 'powershell';
    args = [
      '-c',
      `$m = New-Object -ComObject WMPlayer.OCX; $m.URL='${filePath}'; $m.controls.play(); Start-Sleep -s 3`,
    ];
  } else {
    return;
  }

  try {
    const child = spawn(command, args, { stdio: 'ignore', detached: false });
    child.on('error', () => {});
  } catch {
    // Silent catch
  }
}
