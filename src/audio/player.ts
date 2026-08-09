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
  const candidates = [
    join(__dirname, '../../assets/audio', filename),
    join(__dirname, '../assets/audio', filename),
    join(__dirname, './assets/audio', filename),
    join(process.cwd(), 'assets/audio', filename),
    join(process.cwd(), 'dist/assets/audio', filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback to primary expected path
  return join(process.cwd(), 'assets/audio', filename);
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
 * Plays an MP3 audio file asynchronously using native OS CLI players.
 */
export function playAudioFile(filePath: string): void {
  if (!existsSync(filePath)) {
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
    const child = spawn(command, args, {
      stdio: 'ignore',
      detached: false,
    });

    child.on('error', () => {
      // Gracefully ignore audio player errors (e.g. missing audio device or CLI tool in CI)
    });
  } catch (e) {
    // Silent catch
  }
}
