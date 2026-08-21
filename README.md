# `@ezihegodswill/eslint-formatter-faaah`

An audio-interactive custom ESLint formatter built using **Bun**, **TypeScript**, and **`@ezihegodswill/native-audio-player`**.

Whenever ESLint encounters lint errors or warnings in your project, `@ezihegodswill/eslint-formatter-faaah` plays a signature **"Faaah"** sound effect while delegating standard text output directly to ESLint's native `stylish` formatter.

---

## Features

- **Audio Feedback**: Triggers sound playback when `errorCount > 0` or `warningCount > 0`.
- **Delegated `stylish` Output**: 100% authentic ESLint formatting using ESLint's built-in `stylish` CLI formatter.
- **Environment Controls**: Mute audio anytime using `DISABLE_SOUND=true` or automatic CI detection (`CI=true`).
- **Fast & Lightweight**: Zero external CLI binary dependencies; powered natively across macOS, Linux, and Windows via `@ezihegodswill/native-audio-player`.

---

## Quick Start

### Installation

Install `@ezihegodswill/eslint-formatter-faaah` as a dev dependency in your project:

```bash
# Using Bun
bun add -d @ezihegodswill/eslint-formatter-faaah

# Using npm
npm install --save-dev @ezihegodswill/eslint-formatter-faaah

# Using pnpm
pnpm add -D @ezihegodswill/eslint-formatter-faaah
```

---

## Usage

### 1. ESLint CLI (`--formatter`)

Pass `@ezihegodswill/eslint-formatter-faaah` (or `@ezihegodswill/faaah`) to ESLint's `-f` / `--formatter` flag:

```bash
# Using npx
npx eslint --formatter @ezihegodswill/eslint-formatter-faaah .

# Using Bun
bunx eslint -f @ezihegodswill/eslint-formatter-faaah src/
```

### 2. Package.json Script

Add a lint script to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint --formatter @ezihegodswill/eslint-formatter-faaah ."
  }
}
```

Then run:

```bash
bun run lint
```

---

## Muting & CI Environment Controls

Audio playback can be disabled anytime using environment variables:

| Environment Variable | Value | Description |
| -------------------- | ----- | ----------- |
| `DISABLE_SOUND` | `true` / `1` | Disables audio playback explicitly in local terminal sessions. |
| `CI` | `true` / `1` | Automatically mutes audio in Continuous Integration environments (e.g., GitHub Actions). |

Example local mute run:

```bash
DISABLE_SOUND=true bunx eslint -f @ezihegodswill/eslint-formatter-faaah .
```

---

## Development & Testing

```bash
# Typecheck TypeScript code
bun run check-types

# Run unit tests with mocked audio player
bun test

# Build distribution bundle into dist/
bun run build

# Generate changeset for package release
bun run changeset
```

---

## License

MIT © [Godswill Ezihe](https://github.com/ezihegodswill)
