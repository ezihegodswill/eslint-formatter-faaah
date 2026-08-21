import type { ESLint } from "eslint";
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import faaahFormatter, { isSoundDisabled, SOUND_PATH } from "./index.js";

// Mock function to intercept audio playback
const mockPlayAudio = mock(() => {});

// Mock the native audio player module directly
mock.module("@ezihegodswill/native-audio-player", () => ({
  playAudio: mockPlayAudio,
}));

describe("@ezihegodswill/eslint-formatter-faaah", () => {
  const originalDisableSound = process.env.DISABLE_SOUND;
  const originalCI = process.env.CI;

  beforeEach(() => {
    mockPlayAudio.mockClear();
    delete process.env.DISABLE_SOUND;
    delete process.env.CI;
  });

  afterEach(() => {
    if (originalDisableSound !== undefined) {
      process.env.DISABLE_SOUND = originalDisableSound;
    } else {
      delete process.env.DISABLE_SOUND;
    }

    if (originalCI !== undefined) {
      process.env.CI = originalCI;
    } else {
      delete process.env.CI;
    }
  });

  it("triggers audio playback when lint errors exist", async () => {
    const mockResults: ESLint.LintResult[] = [
      {
        filePath: "/path/to/file.ts",
        messages: [
          {
            ruleId: "no-console",
            severity: 2,
            message: "Unexpected console statement.",
            line: 1,
            column: 1,
          },
        ],
        suppressedMessages: [],
        errorCount: 1,
        warningCount: 0,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ];

    const output = await faaahFormatter(mockResults);
    expect(mockPlayAudio).toHaveBeenCalledTimes(1);
    expect(mockPlayAudio).toHaveBeenCalledWith(SOUND_PATH);
    expect(typeof output).toBe("string");
  });

  it("triggers audio playback when lint warnings exist", async () => {
    const mockResults: ESLint.LintResult[] = [
      {
        filePath: "/path/to/file.ts",
        messages: [
          {
            ruleId: "semi",
            severity: 1,
            message: "Missing semicolon.",
            line: 5,
            column: 10,
          },
        ],
        suppressedMessages: [],
        errorCount: 0,
        warningCount: 1,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ];

    const output = await faaahFormatter(mockResults);
    expect(mockPlayAudio).toHaveBeenCalledTimes(1);
    expect(mockPlayAudio).toHaveBeenCalledWith(SOUND_PATH);
    expect(typeof output).toBe("string");
  });

  it("does NOT trigger audio when codebase is clean", async () => {
    const mockResults: ESLint.LintResult[] = [
      {
        filePath: "/path/to/clean.ts",
        messages: [],
        suppressedMessages: [],
        errorCount: 0,
        warningCount: 0,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ];

    const output = await faaahFormatter(mockResults);
    expect(mockPlayAudio).not.toHaveBeenCalled();
    expect(typeof output).toBe("string");
  });

  it("does NOT trigger audio when DISABLE_SOUND=true", async () => {
    process.env.DISABLE_SOUND = "true";

    const mockResults: ESLint.LintResult[] = [
      {
        filePath: "/path/to/file.ts",
        messages: [
          {
            ruleId: "no-console",
            severity: 2,
            message: "Unexpected console statement.",
            line: 1,
            column: 1,
          },
        ],
        suppressedMessages: [],
        errorCount: 1,
        warningCount: 0,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ];

    await faaahFormatter(mockResults);
    expect(mockPlayAudio).not.toHaveBeenCalled();
  });

  it("does NOT trigger audio when CI=true", async () => {
    process.env.CI = "true";

    const mockResults: ESLint.LintResult[] = [
      {
        filePath: "/path/to/file.ts",
        messages: [
          {
            ruleId: "no-console",
            severity: 2,
            message: "Unexpected console statement.",
            line: 1,
            column: 1,
          },
        ],
        suppressedMessages: [],
        errorCount: 1,
        warningCount: 0,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ];

    await faaahFormatter(mockResults);
    expect(mockPlayAudio).not.toHaveBeenCalled();
  });

  it("correctly reports sound disabled status helper", () => {
    delete process.env.DISABLE_SOUND;
    delete process.env.CI;
    expect(isSoundDisabled()).toBe(false);

    process.env.DISABLE_SOUND = "1";
    expect(isSoundDisabled()).toBe(true);

    delete process.env.DISABLE_SOUND;
    process.env.CI = "true";
    expect(isSoundDisabled()).toBe(true);
  });

  it("resolves valid sound path", () => {
    expect(SOUND_PATH).toContain("faaah.wav");
  });
});
