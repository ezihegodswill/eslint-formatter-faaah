import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultSoundPlayer } from "./soundPlayer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface AudioSelection {
  filePath: string | null;
  name: string;
  hasAudio: boolean;
}

/**
 * Resolves the absolute path to an audio asset file.
 */
export function resolveAudioPath(filename: string): string {
  const candidates = [
    join(__dirname, "../assets/audio", filename),
    join(__dirname, "../../assets/audio", filename),
    join(__dirname, "./assets/audio", filename),
    join(__dirname, "assets/audio", filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

/**
 * Determines the audio file based on total problem count.
 * - Clean (0 problems): No sound played.
 * - Issues (>0 problems): Faaah Sound (fahhh-pump-sound.mp3).
 */
export function getAudioSelection(totalProblems: number): AudioSelection {
  if (totalProblems > 0) {
    return {
      filePath: resolveAudioPath("fahhh-pump-sound.mp3"),
      name: "Faaah Sound",
      hasAudio: true,
    };
  }

  return {
    filePath: null,
    name: "None",
    hasAudio: false,
  };
}

export function getAudioSelectionForSeverity(
  totalErrors: number,
  totalWarnings: number,
): AudioSelection {
  return getAudioSelection(totalErrors + totalWarnings);
}

/**
 * Checks whether audio playback should be muted (e.g. in CI or test environments).
 */
export function isAudioDisabled(): boolean {
  return (
    process.env.FAAAH_DISABLE_AUDIO === "true" ||
    process.env.FAAAH_DISABLE_AUDIO === "1" ||
    process.env.CI === "true" ||
    process.env.CI === "1"
  );
}

/**
 * Plays an MP3 audio file asynchronously using native OS CLI players.
 */
export function playAudioFile(filePath: string | null): void {
  if (!filePath || isAudioDisabled()) {
    return;
  }

  defaultSoundPlayer.play(filePath);
}
