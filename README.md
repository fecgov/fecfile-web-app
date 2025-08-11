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
```

and run the application with the command:

```
npx -p @angular/cli ng serve
```

to start a local server for the application. The front-end can then be accessed through your browser at port 4200.

### Running end-to-end (E2E) tests

Cypress is used for end-to-end (E2E) tests. [E2E instructions...](https://github.com/fecgov/fecfile-web-app/tree/develop/front-end/cypress#readme)

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

- When making CSP changes, make sure to keep nginx and localhost in sync.
  - [NGINX](https://github.com/fecgov/fecfile-web-app/blob/develop/deploy-config/front-end-nginx-config/nginx.conf)
  - [local](https://github.com/fecgov/fecfile-web-app/blob/develop/front-end/angular.json)

See [Additional Developer Notes](https://github.com/fecgov/fecfile-web-api/wiki/Additional-Developer-Notes).
This project is tested with [BrowserStack](https://browserstack.com).
