import { describe, it, expect, afterEach } from 'bun:test';
import { existsSync } from 'node:fs';
import { getAudioSelectionForSeverity } from '../src/audio/player.js';

describe('Audio Subsystem & Severity Sound Selection', () => {
  it('should select Anime Wow Sound for clean runs (0 errors, 0 warnings)', () => {
    const selection = getAudioSelectionForSeverity(0, 0);

    expect(selection.severityType).toBe('clean');
    expect(selection.name).toBe('Anime Wow Sound');
    expect(selection.filePath).toContain('anime-wow-sound-effect.mp3');
    expect(existsSync(selection.filePath)).toBe(true);
  });

  it('should select Faaah Pump Sound when only warnings are present', () => {
    const selection = getAudioSelectionForSeverity(0, 3);

    expect(selection.severityType).toBe('warning');
    expect(selection.name).toBe('Faaah Pump Sound');
    expect(selection.filePath).toContain('fahhh-pump-sound.mp3');
    expect(existsSync(selection.filePath)).toBe(true);
  });

  it('should select Nawa For Yeauuuh Breauuuh when errors are present', () => {
    const selection = getAudioSelectionForSeverity(2, 0);

    expect(selection.severityType).toBe('error');
    expect(selection.name).toBe('Nawa For Yeauuuh Breauuuh');
    expect(selection.filePath).toContain('nawa-for-yeauhhhh-breauhhhh.mp3');
    expect(existsSync(selection.filePath)).toBe(true);
  });

  it('should prioritize Error sound over Warning sound when both are present', () => {
    const selection = getAudioSelectionForSeverity(1, 5);

    expect(selection.severityType).toBe('error');
    expect(selection.name).toBe('Nawa For Yeauuuh Breauuuh');
    expect(selection.filePath).toContain('nawa-for-yeauhhhh-breauhhhh.mp3');
  });

  describe('Audio Muting & Environment Variable Controls', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('should disable audio when FAAAH_DISABLE_AUDIO is true', async () => {
      const { isAudioDisabled } = await import(`../src/audio/player.js?t=${Date.now()}`);
      process.env.FAAAH_DISABLE_AUDIO = 'true';
      expect(isAudioDisabled()).toBe(true);
    });

    it('should disable audio when running in CI environment', async () => {
      const { isAudioDisabled } = await import(`../src/audio/player.js?t=${Date.now()}`);
      delete process.env.FAAAH_DISABLE_AUDIO;
      delete process.env.FAAAH_ENABLE_AUDIO;
      process.env.CI = 'true';
      expect(isAudioDisabled()).toBe(true);
    });

    it('should allow forcing audio enabled via FAAAH_ENABLE_AUDIO', async () => {
      const { isAudioDisabled } = await import(`../src/audio/player.js?t=${Date.now()}`);
      delete process.env.FAAAH_DISABLE_AUDIO;
      process.env.CI = 'true';
      process.env.FAAAH_ENABLE_AUDIO = 'true';
      expect(isAudioDisabled()).toBe(false);
    });
  });
});
