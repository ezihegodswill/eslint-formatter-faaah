import { describe, it, expect, afterEach } from 'bun:test';
import { existsSync } from 'node:fs';
import { getAudioSelection, isAudioDisabled } from '../src/audio/player.js';

describe('Audio Subsystem & Sound Selection', () => {
  it('should play no sound for clean runs (0 problems)', () => {
    const selection = getAudioSelection(0);

    expect(selection.name).toBe('None');
    expect(selection.filePath).toBeNull();
    expect(selection.hasAudio).toBe(false);
  });

  it('should select Faaah Sound when problems are present', () => {
    const selection = getAudioSelection(3);

    expect(selection.name).toBe('Faaah Sound');
    expect(selection.filePath).toContain('fahhh-pump-sound.mp3');
    expect(existsSync(selection.filePath!)).toBe(true);
    expect(selection.hasAudio).toBe(true);
  });

  describe('Audio Muting & Environment Variable Controls', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('should disable audio when FAAAH_DISABLE_AUDIO is true', () => {
      process.env.FAAAH_DISABLE_AUDIO = 'true';
      expect(isAudioDisabled()).toBe(true);
    });

    it('should disable audio when running in CI environment', () => {
      delete process.env.FAAAH_DISABLE_AUDIO;
      process.env.CI = 'true';
      expect(isAudioDisabled()).toBe(true);
    });
  });
});
