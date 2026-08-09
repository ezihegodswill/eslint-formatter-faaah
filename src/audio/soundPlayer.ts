import { spawn, execSync, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:os';

export interface SoundPlayerOptions {
  /** Optional custom player CLI command (e.g. 'afplay', 'mpg123', 'mpv') */
  player?: string;
  /** Extra CLI arguments to pass to the player */
  args?: string[];
}

export interface PlayerDefinition {
  name: string;
  args: (file: string) => string[];
}

/**
 * Modern cross-platform audio player engine inspired by play-sound.
 * Probes native CLI players without external dependencies.
 */
export class SoundPlayer {
  private preferredPlayer?: string;
  private cachedAvailablePlayer?: { name: string; args: (file: string) => string[] };

  constructor(options: SoundPlayerOptions = {}) {
    this.preferredPlayer = options.player;
  }

  /**
   * Returns a list of candidate CLI players grouped by OS platform.
   */
  private getCandidatePlayers(): PlayerDefinition[] {
    const currentPlatform = platform();

    if (currentPlatform === 'darwin') {
      return [
        { name: 'afplay', args: (f) => [f] },
        { name: 'mpv', args: (f) => ['--no-terminal', f] },
        { name: 'mplayer', args: (f) => ['-really-quiet', f] },
      ];
    }

    if (currentPlatform === 'win32') {
      return [
        {
          name: 'powershell',
          args: (f) => [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            `$m = New-Object -ComObject WMPlayer.OCX; $m.URL='${f.replace(/'/g, "''")}'; $m.controls.play(); Start-Sleep -s 3`,
          ],
        },
        { name: 'cmdmp3', args: (f) => [f] },
      ];
    }

    // Linux / BSD / POSIX
    return [
      { name: 'paplay', args: (f) => [f] },
      { name: 'pw-play', args: (f) => [f] },
      { name: 'mpg123', args: (f) => ['-q', f] },
      { name: 'mpg321', args: (f) => ['-q', f] },
      { name: 'mpv', args: (f) => ['--no-terminal', f] },
      { name: 'mplayer', args: (f) => ['-really-quiet', f] },
      { name: 'ffplay', args: (f) => ['-nodisp', '-autoexit', '-loglevel', 'quiet', f] },
      { name: 'cvlc', args: (f) => ['--play-and-exit', f] },
      { name: 'aplay', args: (f) => ['-q', f] },
    ];
  }

  /**
   * Finds the first available binary player on the current OS.
   */
  public findAvailablePlayer(): PlayerDefinition | null {
    if (this.cachedAvailablePlayer) {
      return this.cachedAvailablePlayer;
    }

    const candidates = this.getCandidatePlayers();

    if (this.preferredPlayer) {
      const custom = candidates.find((c) => c.name === this.preferredPlayer);
      if (custom) return custom;
      return { name: this.preferredPlayer, args: (f) => [f] };
    }

    for (const candidate of candidates) {
      if (platform() === 'win32' && candidate.name === 'powershell') {
        this.cachedAvailablePlayer = candidate;
        return candidate;
      }

      try {
        execSync(`command -v ${candidate.name}`, { stdio: 'ignore' });
        this.cachedAvailablePlayer = candidate;
        return candidate;
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Plays an audio file asynchronously.
   */
  public play(filePath: string, customArgs?: string[]): ChildProcess | null {
    if (!existsSync(filePath)) {
      return null;
    }

    const playerDef = this.findAvailablePlayer();
    if (!playerDef) {
      return null;
    }

    const args = customArgs ?? playerDef.args(filePath);

    try {
      const child = spawn(playerDef.name, args, { stdio: 'ignore', detached: false });
      child.on('error', () => {});
      return child;
    } catch {
      return null;
    }
  }
}

/** Default singleton instance */
export const defaultSoundPlayer = new SoundPlayer();
