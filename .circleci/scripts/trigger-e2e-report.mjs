const circleToken = process.env.CIRCLE_TOKEN;
const projectSlug = process.env.CIRCLE_PROJECT_SLUG;
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const branch = process.env.CIRCLE_BRANCH;
const sha = process.env.CIRCLE_SHA1;
const jobName = process.env.CIRCLE_JOB || '';

const dedupeConfig = {
  delayMs: defaultDelayMs(jobName),
  maxPipelines: 10,
  lookbackMs: 2 * 60 * 60 * 1000,
};

async function main() {
  if (!circleToken || !projectSlug || !workflowId || !branch) {
    console.error('Missing CircleCI token, project slug, workflow id, or branch.');
    return;
  }

  let runContext = 'primary';
  try {
    const workflow = await fetchJson(`/workflow/${workflowId}`, circleToken);
    runContext = inferRunContext(workflow?.name || '');
  } catch (error) {
    console.error(`Failed to resolve workflow name: ${error.message}`);
  }

  if (dedupeConfig.delayMs > 0) {
    // Give the other suite a chance to trigger first to avoid duplicates.
    await delay(dedupeConfig.delayMs);
  }

  const alreadyTriggered = await reportPipelineExists({
    projectSlug,
    branch,
    workflowId,
    circleToken,
  });
  if (alreadyTriggered) {
    console.log(`Report pipeline already triggered for workflow ${workflowId}.`);
    return;
  }

  const payload = {
    branch,
    parameters: {
      'run-e2e-report': true,
      'report-workflow-id': workflowId,
      'report-branch': branch,
      'report-sha': sha || '',
      'report-run-context': runContext,
    },
  };

  try {
    await postJson(`/project/${projectSlug}/pipeline`, circleToken, payload);
    console.log(`Triggered report pipeline for workflow ${workflowId}.`);
  } catch (error) {
    console.error(`Failed to trigger report pipeline: ${error.message}`);
  }
}

function inferRunContext(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes('nightly')) {
    return 'nightly';
  }
  if (normalized.startsWith('triggered')) {
    return 'triggered';
  }
  return 'primary';
}

function defaultDelayMs(name) {
  const normalized = (name || '').toLowerCase();
  if (normalized.includes('extended')) {
    return 8000;
  }
  if (normalized.includes('smoke')) {
    return 0;
  }
  return 2000;
}

async function reportPipelineExists({ projectSlug, branch, workflowId, circleToken }) {
  if (!projectSlug || !branch || !workflowId || !circleToken) {
    return false;
  }

  try {
    const response = await fetchJson(
      `/project/${projectSlug}/pipeline?branch=${encodeURIComponent(branch)}`,
      circleToken,
    );
    const items = Array.isArray(response.items) ? response.items : [];
    const cutoff = Date.now() - dedupeConfig.lookbackMs;
    let checked = 0;

    for (const item of items) {
      if (checked >= dedupeConfig.maxPipelines) {
        break;
      }
      checked += 1;
      if (!item?.id) {
        continue;
      }
      if (item.created_at && Date.parse(item.created_at) < cutoff) {
        break;
      }
      if (hasReportParams(item.parameters, workflowId)) {
        return true;
      }
      try {
        const pipeline = await fetchJson(`/pipeline/${item.id}`, circleToken);
        if (hasReportParams(pipeline?.parameters, workflowId)) {
          return true;
        }
      } catch (error) {
        console.error(`Failed to inspect pipeline ${item.id}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Failed to check for existing report pipeline: ${error.message}`);
  }

  return false;
}

function hasReportParams(parameters, workflowId) {
  if (!parameters || typeof parameters !== 'object') {
    return false;
  }
  const runReport =
    parameters['run-e2e-report'] === true || parameters['run-e2e-report'] === 'true';
  if (!runReport) {
    return false;
  }
  const reportWorkflowId = parameters['report-workflow-id'];
  if (!reportWorkflowId) {
    return false;
  }
  return String(reportWorkflowId) === workflowId;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(pathname, token) {
  const response = await fetch(`https://circleci.com/api/v2${pathname}`, {
    headers: { 'Circle-Token': token },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CircleCI API error ${response.status}: ${text}`);
  }
  return response.json();
}

async function postJson(pathname, token, body) {
  const response = await fetch(`https://circleci.com/api/v2${pathname}`, {
    method: 'POST',
    headers: {
      'Circle-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CircleCI API error ${response.status}: ${text}`);
  }
  return response.json();
}

main()
  .catch((error) => {
    console.error(`Trigger pipeline failed: ${error.message}`);
  })
  .finally(() => {
    process.exit(0);
  });
