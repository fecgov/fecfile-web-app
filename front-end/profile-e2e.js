const crypto = require('crypto');
const { spawnSync } = require('child_process');

const runId =
  process.env.FECFILE_PROFILE_RUN_ID ||
  (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
console.log(`[profile] FECFILE_PROFILE_RUN_ID=${runId}`);

const result = spawnSync('npx', ['cypress', 'run'], {
  stdio: 'inherit',
  env: { ...process.env, FECFILE_PROFILE_RUN_ID: runId },
});

process.exit(result.status ?? 1);
