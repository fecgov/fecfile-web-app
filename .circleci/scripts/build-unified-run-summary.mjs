import fs from 'node:fs/promises';
import path from 'node:path';

const args = parseArgs(process.argv);
const outPath = args.out || '/tmp/cypress/out/run-summary.md';
const projectSlug = args['project-slug'] || process.env.CIRCLE_PROJECT_SLUG;
const workflowId =
  args['workflow-id'] || process.env.SOURCE_WORKFLOW_ID || process.env.CIRCLE_WORKFLOW_ID;
const circleToken = process.env.CIRCLE_TOKEN;

const suiteSpecGlobs = {
  'e2e-smoke': 'cypress/e2e-smoke/**/*.cy.ts',
  'e2e-extended': 'cypress/e2e-extended/**/*.cy.ts',
};

const waitConfig = {
  pollMs: Number(process.env.E2E_REPORT_POLL_MS) || 15000,
  maxWaitMs: Number(process.env.E2E_REPORT_MAX_WAIT_MS) || 45 * 60 * 1000,
  discoverMs: Number(process.env.E2E_REPORT_DISCOVER_MS) || 2 * 60 * 1000,
  settleMs: Number(process.env.E2E_REPORT_SETTLE_MS) || 5000,
};

const terminalStatuses = new Set([
  'success',
  'failed',
  'canceled',
  'not_run',
  'blocked',
  'unauthorized',
  'infrastructure_fail',
  'timedout',
]);

async function main() {
  const branch = process.env.SOURCE_BRANCH || process.env.CIRCLE_BRANCH || 'unknown';
  const sha = process.env.SOURCE_SHA || process.env.CIRCLE_SHA1 || 'unknown';
  const workflowUrl = workflowId ? `https://app.circleci.com/workflows/${workflowId}` : 'unknown';
  let summary = '';

  try {
    if (!circleToken || !projectSlug || !workflowId) {
      summary = buildFallbackSummary({
        branch,
        sha,
        workflowUrl,
        reason: 'Missing CircleCI token, project slug, or workflow id.',
      });
    } else {
      await waitForE2EJobs({ workflowId, circleToken }).catch((error) => {
        console.error(`E2E wait failed: ${error.message}`);
      });
      const jobs = await fetchAllCircleci(`/workflow/${workflowId}/job`, circleToken);
      const suiteJobs = collectSuiteJobs(jobs);
      const suiteDetails = await buildSuiteDetails(suiteJobs, projectSlug, circleToken);
      summary = buildSummary({
        branch,
        sha,
        workflowUrl,
        suiteDetails,
      });
    }
  } catch (error) {
    summary = buildFallbackSummary({
      branch,
      sha,
      workflowUrl,
      reason: `Error while building summary: ${error.message}`,
    });
  }

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, summary);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      parsed[key] = next;
      i += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

async function fetchAllCircleci(pathname, token) {
  const items = [];
  let nextPageToken = null;
  do {
    const url = new URL(`https://circleci.com/api/v2${pathname}`);
    if (nextPageToken) {
      url.searchParams.set('page-token', nextPageToken);
    }
    const response = await fetch(url, {
      headers: {
        'Circle-Token': token,
      },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`CircleCI API error ${response.status}: ${text}`);
    }
    const payload = await response.json();
    if (Array.isArray(payload.items)) {
      items.push(...payload.items);
    }
    nextPageToken = payload.next_page_token || null;
  } while (nextPageToken);

  return items;
}

async function waitForE2EJobs({ workflowId: workflow, circleToken: token }) {
  if (!workflow || !token) {
    return;
  }

  const start = Date.now();
  let seenSuiteJobs = false;

  while (Date.now() - start < waitConfig.maxWaitMs) {
    const jobs = await fetchAllCircleci(`/workflow/${workflow}/job`, token);
    const suiteJobs = (jobs || []).filter((job) => suiteSpecGlobs[job.name]);

    if (suiteJobs.length === 0) {
      if (!seenSuiteJobs && Date.now() - start < waitConfig.discoverMs) {
        await delay(waitConfig.pollMs);
        continue;
      }
      return;
    }

    seenSuiteJobs = true;
    const allDone = suiteJobs.every((job) => isTerminalStatus(job.status));
    if (allDone) {
      if (waitConfig.settleMs > 0) {
        await delay(waitConfig.settleMs);
      }
      return;
    }

    await delay(waitConfig.pollMs);
  }
}

function isTerminalStatus(status) {
  return terminalStatuses.has(status || '');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function collectSuiteJobs(jobs) {
  const suiteJobs = {};
  for (const job of jobs || []) {
    if (suiteSpecGlobs[job.name]) {
      suiteJobs[job.name] = {
        name: job.name,
        status: job.status || 'unknown',
        jobNumber: job.job_number,
        webUrl: job.web_url,
      };
    }
  }
  return suiteJobs;
}

async function buildSuiteDetails(suiteJobs, projectSlug, circleToken) {
  const suiteDetails = {};
  const suites = Object.keys(suiteJobs);

  for (const suite of suites) {
    const job = suiteJobs[suite];
    const artifacts = await fetchAllCircleci(
      `/project/${projectSlug}/${job.jobNumber}/artifacts`,
      circleToken,
    );

    const filtered = {
      results: filterArtifacts(artifacts, 'cypress/results/'),
      screenshots: filterArtifacts(artifacts, 'cypress/screenshots/'),
      videos: filterArtifacts(artifacts, 'cypress/videos/'),
      debug: filterArtifacts(artifacts, 'cypress/debug/'),
    };

    suiteDetails[suite] = {
      job,
      artifacts: filtered,
      retrySpecs: computeRetrySpecs(filtered.screenshots.map((item) => item.path)),
    };
  }

  return suiteDetails;
}

function filterArtifacts(artifacts, needle) {
  return (artifacts || []).filter((item) => item.path && item.path.includes(needle));
}

function computeRetrySpecs(paths) {
  const specMap = new Map();
  for (const filePath of paths) {
    const spec = extractSpecFromScreenshotPath(filePath);
    if (!spec) {
      continue;
    }
    const fileName = filePath.split('/').pop() || '';
    const entry = specMap.get(spec) || {
      attempt2: false,
      testCounts: new Map(),
    };

    if (/attempt 2/i.test(fileName)) {
      entry.attempt2 = true;
    }

    const baseName = normalizeScreenshotName(fileName);
    if (baseName) {
      entry.testCounts.set(baseName, (entry.testCounts.get(baseName) || 0) + 1);
    }

    specMap.set(spec, entry);
  }

  const retriedSpecs = [];
  for (const [spec, entry] of specMap) {
    const repeatedTest = Array.from(entry.testCounts.values()).some((count) => count > 1);
    if (entry.attempt2 || repeatedTest) {
      retriedSpecs.push(spec);
    }
  }
  return retriedSpecs.sort();
}

function extractSpecFromScreenshotPath(filePath) {
  const parts = filePath.split('/');
  const index = parts.indexOf('screenshots');
  if (index === -1 || parts.length <= index + 2) {
    return null;
  }
  return parts.slice(index + 1, -1).join('/');
}

function normalizeScreenshotName(fileName) {
  return fileName
    .replace(/\s*\(attempt \d+\)/i, '')
    .replace(/\s*\(failed\)/i, '')
    .replace(/\.(png|jpg|jpeg)$/i, '')
    .trim();
}

function buildSummary({ branch, sha, workflowUrl, suiteDetails }) {
  const lines = [];
  lines.push('# Cypress E2E Run Summary');
  lines.push('');
  lines.push(`Workflow: ${workflowUrl}`);
  lines.push(`Branch: ${branch}`);
  lines.push(`Commit: ${sha}`);
  lines.push('');
  lines.push('Spec globs:');

  const suites = Object.keys(suiteSpecGlobs).filter((suite) => suiteDetails[suite]);
  if (suites.length === 0) {
    Object.entries(suiteSpecGlobs).forEach(([suite, glob]) => {
      lines.push(`- ${suite}: \`${glob}\``);
    });
    lines.push('');
    lines.push('No e2e jobs found for this workflow.');
    lines.push('');
    return lines.join('\n');
  }

  suites.forEach((suite) => {
    lines.push(`- ${suite}: \`${suiteSpecGlobs[suite]}\``);
  });
  lines.push('');

  for (const suite of suites) {
    const details = suiteDetails[suite];
    const { job, artifacts, retrySpecs } = details;
    const resultArtifacts = preferHtmlResults(artifacts.results);
    lines.push(`<!-- suite:${suite}:start -->`);
    lines.push(`## ${suite} - ${job.status || 'unknown'}`);
    lines.push(`Job: ${job.webUrl || 'unknown'}`);
    lines.push(`Status: \`${job.status || 'unknown'}\``);
    lines.push(`Artifacts - Results: ${formatArtifacts(resultArtifacts, 5)}`);
    lines.push(`Artifacts - Screenshots: ${formatArtifacts(artifacts.screenshots, 5)}`);
    lines.push(`Artifacts - Videos: ${formatArtifacts(artifacts.videos, 5)}`);
    lines.push(`Artifacts - Debug: ${formatArtifacts(artifacts.debug, 3)}`);
    lines.push(
      `Retry hints: ${
        retrySpecs.length ? `retried specs: ${retrySpecs.join(', ')}` : 'none'
      }`,
    );
    lines.push(`<!-- suite:${suite}:end -->`);
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function preferHtmlResults(results) {
  const htmlResults = results.filter((item) => item.path && item.path.endsWith('.html'));
  return htmlResults.length ? htmlResults : results;
}

function formatArtifacts(items, maxItems) {
  if (!items || items.length === 0) {
    return 'none';
  }
  const sorted = [...items].sort((a, b) => (a.path || '').localeCompare(b.path || ''));
  const limited = sorted.slice(0, maxItems);
  const links = limited.map((item) => {
    const name = item.path ? path.basename(item.path) : 'artifact';
    return `[${name}](${item.url})`;
  });
  const extraCount = items.length - limited.length;
  const extra = extraCount > 0 ? ` (+${extraCount} more)` : '';
  const countLabel = items.length === 1 ? 'file' : 'files';
  return `${items.length} ${countLabel}: ${links.join(', ')}${extra}`;
}

function buildFallbackSummary({ branch, sha, workflowUrl, reason }) {
  const lines = [];
  lines.push('# Cypress E2E Run Summary');
  lines.push('');
  lines.push(`Workflow: ${workflowUrl}`);
  lines.push(`Branch: ${branch}`);
  lines.push(`Commit: ${sha}`);
  lines.push('');
  lines.push(`Summary unavailable: ${reason}`);
  lines.push('');
  lines.push('Spec globs:');
  Object.entries(suiteSpecGlobs).forEach(([suite, glob]) => {
    lines.push(`- ${suite}: \`${glob}\``);
  });
  lines.push('');
  return lines.join('\n').trimEnd();
}

main().catch((error) => {
  console.error(`Summary generation failed: ${error.message}`);
  process.exit(0);
});
