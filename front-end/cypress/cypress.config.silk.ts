/// <reference types="cypress" />

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const HEADER_VALUE_MAX = 200;
const PYTHON_CANDIDATES = ['python3', 'python'];

const sanitizeHeaderValue = (value: string) =>
  value
    .replaceAll(/[\r\n]+/g, ' ')
    .replaceAll(/[\\/]+/g, '_')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .slice(0, HEADER_VALUE_MAX);

const generateRunId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString('hex');
};

const getSpecGroupName = (spec: Cypress.Spec) =>
  sanitizeHeaderValue(spec.relative || spec.name || 'unknown-spec');

const resolveApiRoot = (apiRoot?: string) => {
  if (!apiRoot) {
    return null;
  }
  const direct = path.join(apiRoot, 'manage.py');
  if (fs.existsSync(direct)) {
    return apiRoot;
  }
  const nested = path.join(apiRoot, 'django-backend', 'manage.py');
  if (fs.existsSync(nested)) {
    return path.join(apiRoot, 'django-backend');
  }
  return null;
};

const runPython = (pythonBin: string, args: string[], cwd: string) =>
  new Promise<{ pythonBin: string; code?: number; error?: Error }>((resolve) => {
    let settled = false;
    const done = (result: { pythonBin: string; code?: number; error?: Error }) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
    };

    const proc = spawn(pythonBin, args, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, ENABLE_RESTRICTED_COMMANDS: '1' },
    });
    proc.on('error', (error) => done({ pythonBin, error }));
    proc.on('close', (code) => done({ pythonBin, code: code ?? 1 }));
  });

const getPythonCandidates = () => {
  const configuredPython = process.env["FECFILE_API_PYTHON"];
  const candidates: string[] = [];
  if (configuredPython) {
    candidates.push(configuredPython);
  }
  candidates.push(...PYTHON_CANDIDATES);
  return candidates;
};

const maybeExportSilk = async ({
  apiRoot,
  runId,
  outdir,
  client,
  group,
}: {
  apiRoot?: string;
  runId: string;
  outdir: string;
  client?: string;
  group?: string;
}) => {
  const resolvedApiRoot = resolveApiRoot(apiRoot);
  if (!resolvedApiRoot) {
    console.warn(
      `[profile] manage.py not found under FECFILE_API_ROOT=${apiRoot}; skipping silk_export_profile.`,
    );
    return;
  }

  const args = ['manage.py', 'silk_export_profile', '--run-id', runId, '--outdir', outdir];
  if (client) {
    args.push('--client', client);
  }
  if (group) {
    args.push('--group', group);
  }

  for (const pythonBin of getPythonCandidates()) {
    const result = await runPython(pythonBin, args, resolvedApiRoot);
    if (result.error) {
      if ((result.error as NodeJS.ErrnoException).code === 'ENOENT') {
        continue;
      }
      console.warn(`[profile] silk_export_profile failed: ${result.error.message}`);
      return;
    }
    if (result.code && result.code !== 0) {
      console.warn(`[profile] silk_export_profile exited with code ${result.code}`);
    }
    return;
  }

  console.warn('[profile] No python interpreter found (tried python, python3).');
};

export const silCy = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Cypress.PluginConfigOptions => {
  on('task', {
    debugApi(message: string) {
      console.log(message);
      return null;
    },
  });

  const existingRunId =
    config.env["FECFILE_PROFILE_RUN_ID"] || process.env["FECFILE_PROFILE_RUN_ID"];
  const runId = existingRunId || generateRunId();
  config.env["FECFILE_PROFILE_RUN_ID"] = runId;
  process.env["FECFILE_PROFILE_RUN_ID"] = runId;
  console.log(`[profile] FECFILE_PROFILE_RUN_ID=${runId}`);

  const apiRoot = process.env["FECFILE_API_ROOT"];
  const outdir = process.env["FECFILE_SILK_OUTDIR"] || "silk";

  on('after:spec', (spec: Cypress.Spec) => {
    const group = getSpecGroupName(spec);
    return maybeExportSilk({ apiRoot, runId, outdir, client: 'cypress', group });
  });

  on('after:run', () => maybeExportSilk({ apiRoot, runId, outdir }));

  return config;
};
