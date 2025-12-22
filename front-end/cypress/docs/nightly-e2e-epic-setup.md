# Nightly E2E epic setup

Use this each sprint to make sure nightly incident issues are grouped under a sprint epic in Jira without any Jira API automation.

## 1) Find or create the sprint epic in Jira
1. In GitHub, ensure the epic issue exists with the exact title:
   Nightly E2E Stability &ndash; Sprint &lt;NIGHTLY_SPRINT&gt;
2. In Jira, search for that same title. If Exalate auto-created the epic from GitHub, it will appear in results.
3. If it does not exist, create a new Epic in the FECFILE project with that exact summary.

## 2) Link incident issues to the epic in Jira
1. Open a nightly incident issue in Jira.
2. Set the Parent field to the sprint epic (preferred). If your Jira UI uses Epic Link instead, set Epic Link to the sprint epic.

## 3) Useful JQL
project = FECFILE AND labels = nightly-e2e AND labels = nightly-sprint-&lt;N&gt; AND statusCategory != Done

parent = &lt;EPIC-KEY&gt;

## 4) Optional Jira automation (admin only)
If you want this to happen automatically:
1. Create a Jira Automation rule.
2. Trigger: Issue created or updated.
3. Condition: labels contains nightly-e2e AND labels contains nightly-sprint-&lt;N&gt;.
4. Action: set Parent (or Epic Link) to the sprint epic.
