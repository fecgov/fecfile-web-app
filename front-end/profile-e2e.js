const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const runId =
  process.env.FECFILE_PROFILE_RUN_ID ||
  (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
console.log(`[profile] FECFILE_PROFILE_RUN_ID=${runId}`);

let cypressBin;
try {
  cypressBin = require.resolve('cypress/bin/cypress');
} catch (error) {
  console.error('[profile] Unable to resolve Cypress binary.', error);
  process.exit(1);
}

const safePath = '/usr/bin:/bin';

const result = spawnSync(process.execPath, [cypressBin, 'run'], {
  stdio: 'inherit',
  env: { ...process.env, FECFILE_PROFILE_RUN_ID: runId, PATH: safePath },
});

process.exit(result.status ?? 1);
