## About this project

The Federal Election Commission (FEC) is the independent regulatory agency
charged with administering and enforcing the federal campaign finance law.
The FEC has jurisdiction over the financing of campaigns for the U.S. House,
Senate, Presidency and the Vice Presidency.

This project will provide a web application for filling out FEC campaign
finance information. The project code is distributed across these repositories:

- [fecfile-web-app](https://github.com/fecgov/fecfile-web-app): this is the browser-based front-end developed in Angular
- [fecfile-web-api](https://github.com/fecgov/fecfile-web-api): RESTful API supporting the front-end developed in Django
- [fecfile-validate](https://github.com/fecgov/fecfile-validate): data validation rules and engine

The project is hosted on the [cloud.gov](https://cloud.gov/docs/) platform and uses [login.gov](https://www.login.gov/what-is-login/) for authentication.

---

## Set up

### Prerequisites

Software necessary to run the application locally

A Snyk authentication token is needed and should be set as the SNYK_AUTH_TOKEN environment varialbe. This is needed so that the `snyk protect` command can be run to apply security patches to package dependencies. You can setup a free account with [Snyk](https://app.snyk.io/) and obtain a token on the Snyk [Account Settings](https://app.snyk.io/account) page.

### Running the Front-End locally

From within the front-end directory, install packages with 
```
npm install
````
and run the application with the command:
```
npx -p @angular/cli ng serve
```
to start a local server for the application. The front-end can then be accessed through your browser at port 4200.

### Running end-to-end (E2E) tests

To run the end-to-end tests locally, `cd` into the front-end directory and run `ng e2e` at the command line.

# Deployment (FEC team only)

[Deployment instructions...](https://github.com/fecgov/fecfile-web-api/wiki/Deployment)

## Technical Environment Plan

The fecfile-web-api is our system's backend while the fecfile-web-app is the single-page angular app. The fecfile-web-api is deployed as a cloud.gov application per environment (dev, stage, test, and prod). Each cloud.gov fecfile-web-api application has at least two instances running. Similarly, the fecfile-web-app is deployed as a cloud.gov application per environment (dev, stage, test, and prod). There are also at least two instances running per cloud.gov fecfile-web-app application.

The following events occur for fecfile-web-api and fecfile-web-app independently of each other:

- When a branch is merged into the develop branch, it is deployed to the dev environment on cloud.gov
  - The Dev environment is used for the bulk of sprint integration and QA testing
- When a release is cut (creating a release tag in git), that release is deployed to the stage environment on cloud.gov.
  - The Stage environment is used for final deployment preparation, integration testing, and final QA testing.
- When the release is merged into the main branch, it is deployed to the prod and test environments on cloud.gov
  - The Test environment will be used by alpha users.
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

### Snyk security scanning
A Snyk online account has been set up for FEC to monitor the FECFile Online GitHub repositories. The management of vulnerability alerts will be handled as a weekly rotating task performed by a developer who will log into the [Snyk Dashboard](https://app.snyk.io/invite/link/accept?invite=93042de6-4eca-4bb5-bf76-9c2e9f895e24&utm_source=link_invite&utm_medium=referral&utm_campaign=product-link-invite&from=link_invite) and perform the following tasks:

1. Review the vulnerability reports for each of the FECFile Online GitHub repository.
2. Write up a ticket (1 for each reported "Critical" or "High" severity vulnerability) to remediate the vulnerability.
3. Point and mark each ticket with the following tags: "security", "high priority".
4. Move each new ticket into the current sprint and sprint backlog.
5. Update weekly assignment log with tickets created or "None".

The weekly assignment log can be found in the Google drive 🔒  [here](https://docs.google.com/spreadsheets/d/1SNMOyGS4JAKgXQ0RhhzoX7M2ib1vm14dD0LxWNpssP4) 🔒
