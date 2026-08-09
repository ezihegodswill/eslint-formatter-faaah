import { describe, it, expect } from 'bun:test';
import { SoundPlayer } from '../src/audio/soundPlayer.js';

describe('Modern SoundPlayer Engine', () => {
  it('should instantiate without options', () => {
    const player = new SoundPlayer();
    expect(player).toBeDefined();
  });

  it('should find an available audio player for the current OS', () => {
    const player = new SoundPlayer();
    const available = player.findAvailablePlayer();

    expect(available).not.toBeNull();
    expect(typeof available?.name).toBe('string');
    expect(typeof available?.args).toBe('function');
  });

  it('should respect custom preferred player option', () => {
    const player = new SoundPlayer({ player: 'custom-player' });
    const available = player.findAvailablePlayer();

    expect(available?.name).toBe('custom-player');
    expect(available?.args('/path/test.mp3')).toEqual(['/path/test.mp3']);
  });

  it('should return null when trying to play non-existent file', () => {
    const player = new SoundPlayer();
    const child = player.play('/non/existent/path/file.mp3');

    expect(child).toBeNull();
  });
});
