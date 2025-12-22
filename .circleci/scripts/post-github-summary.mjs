import fs from 'node:fs/promises';

const args = parseArgs(process.argv);
const summaryPath = args.summary;
const marker = args.marker;

const githubToken = process.env.GITHUB_TOKEN;
const circleToken = process.env.CIRCLE_TOKEN;
const workflowId = process.env.SOURCE_WORKFLOW_ID || process.env.CIRCLE_WORKFLOW_ID;
const projectSlug = process.env.CIRCLE_PROJECT_SLUG;

const branch = process.env.SOURCE_BRANCH || process.env.CIRCLE_BRANCH || 'unknown';
const sha = process.env.SOURCE_SHA || process.env.CIRCLE_SHA1 || '';
const runContext = process.env.RUN_CONTEXT || '';
const triggerSource = process.env.PIPELINE_TRIGGER_SOURCE || '';
const scheduleName = process.env.PIPELINE_SCHEDULE_NAME || '';
const nightlySprint = resolveNightlySprint(process.env.NIGHTLY_SPRINT, scheduleName);

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
  if (!summaryPath || !marker) {
    console.error('Missing --summary or --marker.');
    return;
  }
  if (!githubToken) {
    console.error('Missing GITHUB_TOKEN.');
    return;
  }

  const summary = await readFileSafe(summaryPath);
  if (!summary) {
    console.error('Summary file not found or empty.');
    return;
  }

  const repo = parseRepo(projectSlug || process.env.GITHUB_REPOSITORY);
  if (!repo) {
    console.error('Unable to determine GitHub repository.');
    return;
  }

  await waitForE2EJobs({ workflowId, circleToken }).catch((error) => {
    console.error(`E2E wait failed: ${error.message}`);
  });

  const suiteStatuses = await fetchSuiteStatuses({
    workflowId,
    circleToken,
  });
  const failedSuites = extractFailedSuites(suiteStatuses);
  const hasFailures = failedSuites.length > 0;

  const prs = await fetchPrsForCommit(repo, sha);
  const openPr = prs.find((pr) => pr.state === 'open');
  const prForComment = openPr || prs[0];

  if (prForComment) {
    await upsertIssueComment(repo, prForComment.number, marker, summary);
  }

  const jiraKey = await findJiraKey({
    branch,
    pr: prForComment,
    repo,
    sha,
  });

  let jiraMappedIssue = null;
  if (jiraKey) {
    jiraMappedIssue = await findOpenIssueByJiraKey(repo, jiraKey);
  }

  let issueTargets = [];
  if (jiraMappedIssue) {
    issueTargets = [jiraMappedIssue];
  } else if (prForComment) {
    issueTargets = await findClosingIssues(repo, prForComment.body || '');
  }

  if (issueTargets.length > 0) {
    await Promise.all(
      issueTargets.map((issue) => upsertIssueComment(repo, issue.number, marker, summary)),
    );
    if (hasFailures) {
      const labels = ['e2e-failure', ...failedSuites];
      await Promise.all(issueTargets.map((issue) => addLabels(repo, issue.number, labels)));
    }
    return;
  }

  const nightlyEligible = isNightlyContext({
    hasOpenPr: Boolean(openPr),
    hasJiraIssue: Boolean(jiraMappedIssue),
    runContext,
    triggerSource,
    scheduleName,
    branch,
  });

  if (!nightlyEligible || !hasFailures) {
    return;
  }

  const epic = await ensureSprintEpic(repo, nightlySprint);
  const incidentIssues = [];
  for (const suite of failedSuites) {
    const incident = await ensureIncidentIssue(repo, suite, branch);
    if (!incident) {
      continue;
    }
    const incidentMarker = `fecfile-nightly-incident:${suite}:${branch}`;
    const suiteSection = extractSuiteSection(summary, suite);
    const epicLine = epic ? `\n\nSprint Epic: ${epic.html_url}` : '';
    await upsertIssueComment(repo, incident.number, incidentMarker, `${suiteSection}${epicLine}`);

    const labels = ['nightly-e2e', 'e2e-failure', suite];
    if (nightlySprint) {
      labels.push(`nightly-sprint-${nightlySprint}`);
    }
    await addLabels(repo, incident.number, labels);
    incidentIssues.push(incident);
  }

  if (incidentIssues.length > 0) {
    await updateRollupIssue({
      repo,
      incidentIssues,
      failedSuites,
      workflowId,
    });
  }
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

function resolveNightlySprint(value, schedule) {
  const explicit = (value || '').trim();
  if (explicit) {
    return explicit;
  }
  if (!schedule) {
    return '';
  }
  const match = schedule.match(/\bsprint[-\s]*([a-z0-9.-]+)\b/i);
  if (!match) {
    return '';
  }
  return `Sprint-${match[1]}`;
}

async function readFileSafe(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content.trim();
  } catch (error) {
    return '';
  }
}

function parseRepo(value) {
  if (!value) {
    return null;
  }
  const parts = value.split('/');
  if (parts.length === 3 && (parts[0] === 'gh' || parts[0] === 'github')) {
    return { owner: parts[1], repo: parts[2] };
  }
  if (parts.length === 2) {
    return { owner: parts[0], repo: parts[1] };
  }
  return null;
}

async function githubRequest(repo, path, options = {}) {
  const url = `https://api.github.com${path}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${githubToken}`,
    'User-Agent': 'fecfile-e2e-report',
  };
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: options.body ? { ...headers, 'Content-Type': 'application/json' } : headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 404) {
    return null;
  }

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function fetchPrsForCommit(repo, shaValue) {
  if (!shaValue) {
    return [];
  }
  try {
    const prs = await githubRequest(
      repo,
      `/repos/${repo.owner}/${repo.repo}/commits/${shaValue}/pulls?per_page=10`,
    );
    return Array.isArray(prs) ? prs : [];
  } catch (error) {
    console.error(`Failed to fetch PRs for commit: ${error.message}`);
    return [];
  }
}

async function findJiraKey({ branch: branchName, pr, repo, sha: shaValue }) {
  let key = extractJiraKey(branchName);
  if (!key && pr) {
    key = extractJiraKey(pr.title) || extractJiraKey(pr.body);
  }
  if (!key && shaValue) {
    const commitMessage = await fetchCommitMessage(repo, shaValue);
    key = extractJiraKey(commitMessage);
  }
  return key;
}

function extractJiraKey(text) {
  if (!text) {
    return null;
  }
  const match = text.match(/\bFECFILE-\d+\b/i);
  return match ? match[0].toUpperCase() : null;
}

async function fetchCommitMessage(repo, shaValue) {
  try {
    const commit = await githubRequest(
      repo,
      `/repos/${repo.owner}/${repo.repo}/commits/${shaValue}`,
    );
    return commit?.commit?.message || '';
  } catch (error) {
    return '';
  }
}

async function findOpenIssueByJiraKey(repo, jiraKey) {
  try {
    const query = `repo:${repo.owner}/${repo.repo} type:issue state:open ${jiraKey}`;
    const result = await githubRequest(
      repo,
      `/search/issues?q=${encodeURIComponent(query)}&per_page=5`,
    );
    const items = result?.items || [];
    return items.find((item) => !item.pull_request) || null;
  } catch (error) {
    console.error(`Failed Jira key search: ${error.message}`);
    return null;
  }
}

async function findClosingIssues(repo, body) {
  const issueNumbers = parseClosingIssueNumbers(body);
  const issues = [];
  for (const number of issueNumbers) {
    const issue = await getIssue(repo, number);
    if (issue) {
      issues.push(issue);
    }
  }
  return issues;
}

function parseClosingIssueNumbers(text) {
  if (!text) {
    return [];
  }
  const numbers = new Set();
  const keyword = '(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)';
  const urlRegex = new RegExp(
    `\\b${keyword}[:\\s]+https://github.com/[^/]+/[^/]+/issues/(\\d+)`,
    'gi',
  );
  const hashRegex = new RegExp(`\\b${keyword}[:\\s]+#(\\d+)`, 'gi');

  let match = null;
  while ((match = urlRegex.exec(text)) !== null) {
    numbers.add(Number(match[1]));
  }
  while ((match = hashRegex.exec(text)) !== null) {
    numbers.add(Number(match[1]));
  }
  return Array.from(numbers);
}

async function getIssue(repo, number) {
  try {
    const issue = await githubRequest(
      repo,
      `/repos/${repo.owner}/${repo.repo}/issues/${number}`,
    );
    if (!issue || issue.pull_request) {
      return null;
    }
    return issue;
  } catch (error) {
    return null;
  }
}

async function upsertIssueComment(repo, issueNumber, markerValue, body) {
  const markerTag = `<!-- ${markerValue} -->`;
  const commentBody = body.includes(markerTag) ? body : `${body}\n\n${markerTag}`;
  const existing = await findCommentByMarker(repo, issueNumber, markerTag);
  if (existing) {
    await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: { body: commentBody },
    });
  } else {
    await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues/${issueNumber}/comments`, {
      method: 'POST',
      body: { body: commentBody },
    });
  }
}

async function findCommentByMarker(repo, issueNumber, markerTag) {
  let page = 1;
  while (page < 6) {
    const comments = await githubRequest(
      repo,
      `/repos/${repo.owner}/${repo.repo}/issues/${issueNumber}/comments?per_page=100&page=${page}`,
    );
    if (!Array.isArray(comments) || comments.length === 0) {
      return null;
    }
    const found = comments.find((comment) => comment.body?.includes(markerTag));
    if (found) {
      return found;
    }
    if (comments.length < 100) {
      return null;
    }
    page += 1;
  }
  return null;
}

async function addLabels(repo, issueNumber, labels) {
  if (!labels || labels.length === 0) {
    return;
  }
  try {
    await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues/${issueNumber}/labels`, {
      method: 'POST',
      body: { labels },
    });
  } catch (error) {
    console.error(`Failed to add labels: ${error.message}`);
  }
}

async function fetchSuiteStatuses({ workflowId: workflow, circleToken: token }) {
  if (!workflow || !token) {
    return {};
  }
  try {
    const jobs = await fetchAllCircleci(`/workflow/${workflow}/job`, token);
    const statuses = {};
    for (const job of jobs || []) {
      if (suiteSpecGlobs[job.name]) {
        statuses[job.name] = job.status || 'unknown';
      }
    }
    return statuses;
  } catch (error) {
    console.error(`Failed to fetch suite statuses: ${error.message}`);
    return {};
  }
}

function extractFailedSuites(statuses) {
  const failed = [];
  for (const [suite, status] of Object.entries(statuses)) {
    if (['failed', 'failing', 'timedout'].includes(status)) {
      failed.push(suite);
    }
  }
  return failed;
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

function isNightlyContext({ hasOpenPr, hasJiraIssue, runContext, triggerSource, scheduleName, branch }) {
  if (hasOpenPr || hasJiraIssue) {
    return false;
  }
  const nightlySignal =
    runContext === 'nightly' ||
    triggerSource === 'scheduled_pipeline' ||
    Boolean(scheduleName && scheduleName.trim());
  if (!nightlySignal) {
    return false;
  }
  return isLongLivedBranch(branch);
}

function isLongLivedBranch(branchName) {
  return (
    branchName === 'develop' ||
    branchName === 'main' ||
    branchName.startsWith('release/')
  );
}

async function ensureSprintEpic(repo, sprint) {
  if (!sprint) {
    return null;
  }
  const exactTitle = `Nightly E2E Stability \u2013 Sprint ${sprint}`;
  const fallbackTitle = `Nightly E2E Stability - Sprint ${sprint}`;

  let issue = await findIssueByTitle(repo, exactTitle, false);
  if (!issue && fallbackTitle !== exactTitle) {
    issue = await findIssueByTitle(repo, fallbackTitle, false);
  }
  if (issue) {
    await ensureIssueOpen(repo, issue);
    await addLabels(repo, issue.number, ['epic']);
    return issue;
  }

  try {
    const created = await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues`, {
      method: 'POST',
      body: {
        title: exactTitle,
        body: `Tracking nightly E2E stability for sprint ${sprint}.`,
        labels: ['epic'],
      },
    });
    return created;
  } catch (error) {
    console.error(`Failed to create sprint epic: ${error.message}`);
    return null;
  }
}

async function ensureIncidentIssue(repo, suite, branchName) {
  const title = `[Nightly][${suite}][${branchName}] Failure Incident`;
  const issue = await findIssueByTitle(repo, title, true);
  if (issue) {
    await ensureIssueOpen(repo, issue);
    return issue;
  }
  try {
    const created = await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues`, {
      method: 'POST',
      body: {
        title,
        body: `Nightly ${suite} failure incident for branch ${branchName}.`,
      },
    });
    return created;
  } catch (error) {
    console.error(`Failed to create incident issue: ${error.message}`);
    return null;
  }
}

async function findIssueByTitle(repo, title, openOnly) {
  try {
    const stateFilter = openOnly ? 'state:open' : '';
    const query = `repo:${repo.owner}/${repo.repo} type:issue ${stateFilter} in:title "${title}"`;
    const result = await githubRequest(
      repo,
      `/search/issues?q=${encodeURIComponent(query)}&per_page=10`,
    );
    const items = result?.items || [];
    return items.find((item) => item.title === title && !item.pull_request) || null;
  } catch (error) {
    console.error(`Failed to search issue by title: ${error.message}`);
    return null;
  }
}

async function ensureIssueOpen(repo, issue) {
  if (issue.state !== 'open') {
    try {
      await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues/${issue.number}`, {
        method: 'PATCH',
        body: { state: 'open' },
      });
    } catch (error) {
      console.error(`Failed to reopen issue: ${error.message}`);
    }
  }
}

function extractSuiteSection(summary, suite) {
  const startTag = `<!-- suite:${suite}:start -->`;
  const endTag = `<!-- suite:${suite}:end -->`;
  const startIndex = summary.indexOf(startTag);
  const endIndex = summary.indexOf(endTag);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return summary;
  }
  return summary.slice(startIndex + startTag.length, endIndex).trim();
}

async function updateRollupIssue({ repo, incidentIssues, failedSuites, workflowId }) {
  const rollupTitle = 'Nightly E2E Failures (Rollup)';
  let rollupIssue = await findIssueByTitle(repo, rollupTitle, false);
  if (!rollupIssue) {
    try {
      rollupIssue = await githubRequest(repo, `/repos/${repo.owner}/${repo.repo}/issues`, {
        method: 'POST',
        body: {
          title: rollupTitle,
          body: 'Daily rollup for nightly E2E failures.',
        },
      });
    } catch (error) {
      console.error(`Failed to create rollup issue: ${error.message}`);
      return;
    }
  } else {
    await ensureIssueOpen(repo, rollupIssue);
  }

  const dateStamp = new Date().toISOString().slice(0, 10);
  const markerValue = `fecfile-nightly-rollup:${dateStamp}`;
  const workflowUrl = workflowId ? `https://app.circleci.com/workflows/${workflowId}` : 'unknown';

  const counts = await countFailuresToday(repo, dateStamp, failedSuites);
  const lines = [];
  lines.push(`Failures today (UTC ${dateStamp}):`);
  lines.push(`- e2e-smoke: ${counts['e2e-smoke'] ?? 0}`);
  lines.push(`- e2e-extended: ${counts['e2e-extended'] ?? 0}`);
  lines.push(`Incidents: ${formatIncidentLinks(incidentIssues)}`);
  lines.push(`Latest workflow: ${workflowUrl}`);

  await upsertIssueComment(repo, rollupIssue.number, markerValue, lines.join('\n'));
}

async function countFailuresToday(repo, dateStamp, fallbackSuites) {
  const counts = { 'e2e-smoke': 0, 'e2e-extended': 0 };
  try {
    const range = buildUtcDateRange(dateStamp);
    for (const suite of Object.keys(counts)) {
      const query = [
        `repo:${repo.owner}/${repo.repo}`,
        'type:issue',
        'label:nightly-e2e',
        `label:${suite}`,
        `created:${range}`,
      ].join(' ');
      const result = await githubRequest(
        repo,
        `/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
      );
      counts[suite] = result?.total_count ?? 0;
    }
  } catch (error) {
    for (const suite of fallbackSuites) {
      counts[suite] = (counts[suite] || 0) + 1;
    }
  }
  return counts;
}

function buildUtcDateRange(dateStamp) {
  const [year, month, day] = dateStamp.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  const end = new Date(Date.UTC(year, month - 1, day + 1));
  return `${start.toISOString().slice(0, 10)}..${end.toISOString().slice(0, 10)}`;
}

function formatIncidentLinks(issues) {
  if (!issues || issues.length === 0) {
    return 'none';
  }
  const links = issues.map((issue) => `[${issue.title}](${issue.html_url})`);
  return links.join(', ');
}

main()
  .catch((error) => {
    console.error(`Post summary failed: ${error.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
