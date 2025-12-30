import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { PluginConfigOptions, PluginEvents } from 'cypress';

const DEFAULT_SILK_OUTDIR = 'silk-artifacts';
const DEFAULT_PYTHON_CANDIDATES = [
  '/usr/bin/python3',
  '/usr/bin/python',
  '/usr/local/bin/python3',
  '/usr/local/bin/python',
];
let warnedMissingStructlog = false;

function sanitizeSpecName(name: string): string {
  if (!name) {
    return 'unknown-spec';
  }

  const trimmed = name.trim();
  let sanitized = '';
  let lastWasUnderscore = false;

  for (const ch of trimmed) {
    const code = ch.codePointAt(0);
    const isAlphaNum = (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isAllowed = isAlphaNum || ch === '.' || ch === '_' || ch === '-';

    if (isAllowed) {
      sanitized += ch;
      lastWasUnderscore = false;
    } else if (!lastWasUnderscore) {
      sanitized += '_';
      lastWasUnderscore = true;
    }
  }

  while (sanitized.startsWith('.') || sanitized.startsWith('_') || sanitized.startsWith('-')) {
    sanitized = sanitized.slice(1);
  }
  while (sanitized.endsWith('.') || sanitized.endsWith('_') || sanitized.endsWith('-')) {
    sanitized = sanitized.slice(0, -1);
  }

  return sanitized || 'unknown-spec';
}

function resolveApiDir(config: PluginConfigOptions): string | null {
  const candidates = [config.env?.FECFILE_WEB_API_DIR, process.env.FECFILE_WEB_API_DIR].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(path.join(resolved, 'manage.py'))) {
      return resolved;
    }
  }

  return null;
}

function resolvePythonBin(config: PluginConfigOptions, apiDir: string): string | null {
  const apiDirCandidates = [
    path.join(apiDir, '.venv', 'bin', 'python'),
    path.join(apiDir, 'venv', 'bin', 'python'),
    path.join(apiDir, 'env', 'bin', 'python'),
    path.join(apiDir, '.venv', 'Scripts', 'python.exe'),
    path.join(apiDir, 'venv', 'Scripts', 'python.exe'),
  ];

  const candidates = [
    config.env?.SILK_PYTHON,
    process.env.SILK_PYTHON,
    config.env?.PYTHON_BIN,
    process.env.PYTHON_BIN,
    process.env.PYTHON,
    ...apiDirCandidates,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const resolved = path.isAbsolute(candidate) ? candidate : path.resolve(candidate);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }

  for (const candidate of DEFAULT_PYTHON_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  console.warn('[silk] Skipping export: set SILK_PYTHON or PYTHON_BIN to an absolute python path');
  return null;
}

function pythonHasStructlog(pythonBin: string, apiDir: string): boolean {
  try {
    execFileSync(pythonBin, ['-c', 'import structlog'], { cwd: apiDir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function exportSilkArtifacts(runId: string, specName: string, config: PluginConfigOptions) {
  const apiDir = resolveApiDir(config);
  if (!apiDir) {
    console.warn('[silk] Skipping export: set FECFILE_WEB_API_DIR to the backend directory containing manage.py');
    return;
  }

  const outDir = config.env?.SILK_OUTDIR || process.env.SILK_OUTDIR || DEFAULT_SILK_OUTDIR;
  const pythonBin = resolvePythonBin(config, apiDir);
  if (!pythonBin) {
    return;
  }
  if (!pythonHasStructlog(pythonBin, apiDir)) {
    if (!warnedMissingStructlog) {
      console.warn(
        `[silk] Skipping export: ${pythonBin} is missing backend deps (structlog). Set SILK_PYTHON to your backend venv python.`,
      );
      warnedMissingStructlog = true;
    }
    return;
  }

  try {
    execFileSync(pythonBin, ['manage.py', 'silk_export', '--run-id', runId, '--spec', specName, '--outdir', outDir], {
      cwd: apiDir,
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn('[silk] Export failed:', error);
  }
}

export function setupSilk(on: PluginEvents, config: PluginConfigOptions): PluginConfigOptions {
  const runId = config.env?.SILK_RUN_ID || process.env.SILK_RUN_ID || randomUUID();
  config.env = config.env || {};
  config.env.SILK_RUN_ID = runId;
  console.log(`[silk] run id: ${runId}`);

  on('task', {
    'api:log': (message: unknown) => {
      if (message !== undefined) {
        console.log(String(message));
      }
      return null;
    },
  });

  on('after:spec', (spec) => {
    const specName = sanitizeSpecName(spec?.name || 'unknown-spec');
    exportSilkArtifacts(runId, specName, config);
  });

  return config;
}
