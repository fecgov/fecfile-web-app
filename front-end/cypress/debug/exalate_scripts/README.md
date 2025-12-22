# Exalate script mirrors (review only)

These files are read-only mirrors of the current Exalate scripts from the integration repo. Updating them here does not change production sync behavior. They are included for review and discussion only.

Mirrored scripts:
- github_in
- github_out
- jira_in
- jira_out

## Optional Exalate improvements (proposal)
These are optional and not required for the CI changes in this repo:
1. Add a small rule in the Jira-side script to derive the `e2e-failure` label when a GitHub comment includes the marker `<!-- fecfile-e2e-summary -->`.
2. Add a Jira-side filter to skip syncing the rollup issue titled `Nightly E2E Failures (Rollup)` if the team decides the rollup should not create Jira noise.
