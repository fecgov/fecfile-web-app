## About this project

The Federal Election Commission (FEC) is the independent regulatory agency
charged with administering and enforcing the federal campaign finance law.
The FEC has jurisdiction over the financing of campaigns for the U.S. House,
Senate, Presidency and the Vice Presidency.

This project will provide a web application for filling out FEC campaign
finance information. The project code is distributed across these repositories:

- [fecfile-web-app](https://github.com/fecgov/fecfile-web-app): this is the browser-based front-end developed in Angualar
- [fecfile-web-api](https://github.com/fecgov/fecfile-web-api): RESTful endpoint supporting the front-end
- [fecfile-validate](https://github.com/fecgov/fecfile-validate): data validation rules and engine
- [fecfile-image-generator](https://github.com/fecgov/fecfile-image-generator): provides competed FEC forms in PDF format

---

## Set up

### Prerequisites

Software necessary to run the application locally

A Snyk authentication token is needed and should be set as the SNYK_AUTH_TOKEN environment varialbe. This is needed so that the `snyk protect` command can be run to apply security patches to package dependencies. You can setup a free account with [Snyk](https://app.snyk.io/) and obtain a token on the Snyk [Account Settings](https://app.snyk.io/account) page.

### Running the Front-End locally

From within the front-end directory, run the command:
`
    ng serve
	`
to start a local server for the application. The front-end can then be accessed through your browser at port 4200.

# Deployment (FEC team only)

### Create a feature branch

Using git-flow extensions:
`   git flow feature start feature_branch
  `

Without the git-flow extensions:
`   git checkout develop
    git pull
    git checkout -b feature/feature_branch develop
  `

- Developer creates a GitHub PR when ready to merge to `develop` branch
- Reviewer reviews and merges feature branch into `develop` via GitHub
- [auto] `develop` is deployed to `dev`

### Create a release branch

- Using git-flow extensions:

```
git flow release start sprint-#
```

- Without the git-flow extensions:

```
git checkout develop
git pull
git checkout -b release/sprint-# develop
git push --set-upstream origin release/sprint-#
```

- Developer creates a PR in GitHub to merge release/sprint-# branch into the `main` branch to track if commits pass deployment checks. The actual merge will happen when deploying a release to production.

### Create and deploy a hotfix

- Using git-flow extensions:

```
git flow hotfix start my-fix
# Work happens here
git flow hotfix finish my-fix
```

- Without the git-flow extensions:

```
git checkout -b hotfix/my-fix main
# Work happens here
git push --set-upstream origin hotfix/my-fix
```

- Developer creates a hotfix branch, commits changes, and **makes a PR to the `main` and `develop` branches**:
- Reviewer merges hotfix/my-fix branch into `develop` and `main`
- [auto] `develop` is deployed to `dev`. Make sure the build passes before deploying to `main`.
- Developer deploys hotfix/my-fix branch to main using **Deploying a release to production** instructions below

### Deploying a release to production

- Reviewer approves release/sprint-# PR and merges into `main` (At this point the code is automatically deployed)
- Check CircleCI for passing pipeline tests
- If tests pass, continue
- (If commits were made to release/sprint-#) Developer creates a PR in GitHub to merge release/sprint-# branch into the `develop` branch
- Reviewer approves PR and merges into `develop`
- Delete release/sprint-# branch
- Publish a new release using tag sprint-#, be sure to Auto-generate release notes
  - On Github, click on "Code" tab, then the "tags" link, then the "Releases" toggle
  - Click the button "Draft a new release"
  - Enter the new sprint tag "sprint-XX"
  - Set Target option to "main"
  - Set Release title to "sprint-XX"
  - Click the button "Generate release notes"
  - Click the "Publish release" button

## Technical Environment Plan

The fecfile-web-api is our system's backend while the fecfile-web-app is the single-page angular app. The fecfile-web-api is deployed as a cloud.gov application per environment (dev, stage, and prod). Each cloud.gov fecfile-web-api application has at least two instances running. Similarly, the fecfile-web-app is deployed as a cloud.gov application per environment (dev, stage, and prod). There are also at least two instances running per cloud.gov fecfile-web-app application.

The following events occur for fecfile-web-api and fecfile-web-app independently of each other:

- When a branch is merged into the develop branch, it is deployed to the dev environment on cloud.gov
  - The Dev environment is used for the bulk of sprint integration and QA testing
- When a release is cut (creating a release tag in git), that release is deployed to the stage environment on cloud.gov.
  - The Stage environment is used for final deployment preparation, integration testing, and final QA testing.
- When the release is merged into the main branch, it is deployed to the prod environment on cloud.gov
  - The Production environment will be used by end users once the application launches.

## Additional developer notes

This section covers a few topics we think might help developers after setup.

### Git Secrets

Set up git secrets to protect oneself from committing sensitive information such as passwords to the repository.

- First install AWS git-secret utility in your PATH so it can be run at the command line: https://github.com/awslabs/git-secrets#installing-git-secrets
- Pull the script to install git-secrets globally on your local machine. This only has to be done one time as you clone the different fecfile github repositories: https://github.com/fecgov/fecfile-web-api/blob/main/install-git-secrets-hook.sh
- Once you have git-secrets installed, run the fecfile-online/install-git-secrets-hook.sh shell script in the root directory of your cloned fecfile-online repo to install the pre-commit hooks.
  NOTE: The pre-commit hook is installed GLOBALLY by default so commits to all cloned repositories on your computer will be scanned for sensitive data. See the comments at the top of the script for local install options.
- See git-secrets README for more features: https://github.com/awslabs/git-secrets#readme

### Commit local code changes to origin daily

As a best practice policy, please commit any feature code changes made during the day to origin each evening before signing off for the day.
