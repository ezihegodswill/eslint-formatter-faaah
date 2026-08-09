#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const formatterPath = join(__dirname, '../formatters/faaah.js');
const userArgs = process.argv.slice(2);

const hasFormatter = userArgs.includes('-f') || userArgs.includes('--formatter');
const eslintArgs = hasFormatter ? userArgs : ['-f', formatterPath, ...userArgs];

const npxCmd = platform() === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(npxCmd, ['eslint', ...eslintArgs], { stdio: 'inherit' });
process.exit(result.status ?? 0);

