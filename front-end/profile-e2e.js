const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const runId =
  process.env.FECFILE_PROFILE_RUN_ID ||
  (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
console.log(`[profile] FECFILE_PROFILE_RUN_ID=${runId}`);
const runStart = Date.now();

const resolveNgCli = () => {
  const localNgCli = path.resolve(
    __dirname,
    'node_modules',
    '@angular',
    'cli',
    'bin',
    'ng.js',
  );
  if (fs.existsSync(localNgCli)) {
    return localNgCli;
  }
  try {
    return require.resolve('@angular/cli/bin/ng');
  } catch (error) {
    return null;
  }
};

const safePath = '/usr/bin:/bin';
let extraArgs = process.env.FECFILE_E2E_ARGS
  ? process.env.FECFILE_E2E_ARGS.trim().split(/\s+/)
  : [];
if (!extraArgs.some((arg) => arg.startsWith('--watch'))) {
  extraArgs = [...extraArgs, '--watch=false'];
}

const ngCli = resolveNgCli();
if (!ngCli) {
  console.error('[profile] Unable to resolve @angular/cli (ng.js).');
  process.exit(1);
}

const result = spawnSync(process.execPath, [ngCli, 'e2e', ...extraArgs], {
  stdio: 'inherit',
  env: { ...process.env, FECFILE_PROFILE_RUN_ID: runId, PATH: safePath },
});

const mergeScript = path.resolve(__dirname, 'scripts', 'merge-mochawesome.js');
let mergeStatus = 0;
if (fs.existsSync(mergeScript)) {
  const mergeResult = spawnSync(process.execPath, [mergeScript], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: safePath,
      FECFILE_PROFILE_RUN_ID: runId,
      FECFILE_MOCHAWESOME_MERGE_SINCE: String(runStart),
    },
  });
  mergeStatus = mergeResult.status ?? 1;
} else {
  console.warn('[profile] Mochawesome merge script not found:', mergeScript);
}

const runStatus = result.status ?? 1;
if (runStatus === 0 && mergeStatus !== 0) {
  process.exit(mergeStatus);
}
process.exit(runStatus);
