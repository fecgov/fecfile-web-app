const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const mochawesomeMerge = require('mochawesome-merge');
const merge =
  (typeof mochawesomeMerge === 'function' ? mochawesomeMerge : null) ||
  mochawesomeMerge?.merge ||
  mochawesomeMerge?.default;

const reportDir = path.resolve(__dirname, '..', 'cypress', 'results');
const runId = process.env.FECFILE_PROFILE_RUN_ID || '';
const mergedBaseName = runId ? `merged-${runId}` : 'merged';
const mergedJson = path.join(reportDir, `${mergedBaseName}.json`);
const margeCli = (() => {
  try {
    return require.resolve('mochawesome-report-generator/bin/cli.js');
  } catch (error) {
    return null;
  }
})();

const runStart = Number(process.env.FECFILE_MOCHAWESOME_MERGE_SINCE || 0);
const jsonFiles = fs
  .readdirSync(reportDir, { withFileTypes: true })
  .filter((entry) => {
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      return false;
    }
    if (entry.name === path.basename(mergedJson)) {
      return false;
    }
    if (!runStart) {
      return true;
    }
    const stat = fs.statSync(path.join(reportDir, entry.name));
    return stat.mtimeMs >= runStart;
  })
  .map((entry) => path.join(reportDir, entry.name));

if (!jsonFiles.length) {
  console.log('[profile] No mochawesome JSON files found to merge.');
  process.exit(0);
}

if (typeof merge !== 'function') {
  console.error('[profile] mochawesome-merge did not export a merge function.');
  process.exit(1);
}

if (!margeCli || !fs.existsSync(margeCli)) {
  console.error('[profile] marge CLI not found.');
  process.exit(1);
}

const run = async () => {
  const report = await merge({ files: jsonFiles });
  fs.writeFileSync(mergedJson, JSON.stringify(report));

  const margeResult = spawnSync(process.execPath, [margeCli, mergedJson, '-o', reportDir, '-f', mergedBaseName], {
    stdio: 'inherit',
  });

  if (margeResult.status !== 0) {
    process.exit(margeResult.status ?? 1);
  }
};

run()
  .then(() => {
    console.log('[profile] merged mochawesome report written to', mergedJson);
  })
  .catch((error) => {
    console.error('[profile] mochawesome merge failed:', error);
    process.exit(1);
  });
